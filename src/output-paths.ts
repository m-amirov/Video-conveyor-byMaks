import fs from 'node:fs';
import path from 'node:path';

const isInside = (parent: string, candidate: string) => {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};

/** Creates a Stage artifact directory only after resolving junctions/symlinks. */
export const ensureSafeWorkspaceDirectory = (root: string, directory: string) => {
  const resolvedRoot = fs.realpathSync(root);
  const workspace = path.resolve(resolvedRoot, 'workspace');
  const requestedDirectory = path.resolve(directory);
  if (!isInside(workspace, requestedDirectory)) throw new Error(`output path is outside workspace: ${directory}`);
  fs.mkdirSync(workspace, {recursive: true});
  const resolvedWorkspace = fs.realpathSync(workspace);
  if (!isInside(resolvedRoot, resolvedWorkspace)) throw new Error('workspace resolves outside repository root');
  fs.mkdirSync(directory, {recursive: true});
  const resolvedDirectory = fs.realpathSync(directory);
  if (!isInside(resolvedWorkspace, resolvedDirectory)) throw new Error(`output path resolves outside workspace: ${directory}`);
  return resolvedDirectory;
};
