import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import type {ErrorObject} from 'ajv';
import type {VideoComposition} from './contracts';

export type ValidationResult = {ok: true; value: VideoComposition} | {ok: false; errors: string[]};
const schemaPath = path.resolve('schemas/video-composition.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')) as object;
const require=createRequire(import.meta.url);
const Ajv2020=require('ajv/dist/2020').default as new (options: object) => {compile<T>(schema: object): ((data: unknown) => data is T) & {errors?: ErrorObject[] | null}};
const addFormats=require('ajv-formats').default as (ajv: object)=>void;
const ajv = new Ajv2020({allErrors: true, strict: true});
addFormats(ajv);
const validateSchema = ajv.compile<VideoComposition>(schema);

const unsafePath = (value: string) => path.isAbsolute(value) || value.split(/[\\/]/).includes('..') || /(^|[\\/])(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|[\\/]|$)/i.test(value);

export const validateProduction = (input: unknown, options: {checkAssets?: boolean; root?: string} = {}): ValidationResult => {
  const errors: string[] = [];
  if (!validateSchema(input)) errors.push(...(validateSchema.errors ?? []).map((e: ErrorObject) => `${e.instancePath || '/'} ${e.message}`));
  if (errors.length) return {ok: false, errors};
  const value = input as VideoComposition;
  const ids = new Set<string>();
  let expectedFrom = 0;
  for (const scene of value.scenes) {
    if (ids.has(scene.id)) errors.push(`duplicate scene id: ${scene.id}`);
    ids.add(scene.id);
    if (scene.from !== expectedFrom) errors.push(`scene ${scene.id} must start at ${expectedFrom}, got ${scene.from}`);
    expectedFrom = scene.from + scene.durationInFrames;
  }
  if (expectedFrom !== value.durationInFrames) errors.push(`scene total ${expectedFrom} does not equal duration ${value.durationInFrames}`);
  for (const caption of value.captions) {
    if (caption.endFrame <= caption.startFrame) errors.push(`caption ${caption.id} has invalid timing`);
    if (caption.endFrame > value.durationInFrames) errors.push(`caption ${caption.id} exceeds composition`);
    if (caption.safeBottom < 180 || caption.maxWidth > value.width - 120) errors.push(`caption ${caption.id} violates safe zone`);
  }
  for (const audio of value.audioTracks) {
    if (audio.from + audio.durationInFrames > value.durationInFrames) errors.push(`audio ${audio.id} exceeds composition`);
    if (audio.fadeInFrames + audio.fadeOutFrames > audio.durationInFrames) errors.push(`audio ${audio.id} fades exceed duration`);
  }
  const assetPaths = [...value.audioTracks.map((a) => a.path), ...value.scenes.flatMap((s) => s.assetRefs), ...value.provenance.map((p) => p.asset)];
  for (const asset of assetPaths) {
    if (unsafePath(asset)) errors.push(`unsafe path: ${asset}`);
    if (options.checkAssets && !fs.existsSync(path.resolve(options.root ?? process.cwd(), asset))) errors.push(`missing asset: ${asset}`);
  }
  return errors.length ? {ok: false, errors} : {ok: true, value};
};

export const loadAndValidateProduction = (file: string, checkAssets = true): ValidationResult => {
  try { return validateProduction(JSON.parse(fs.readFileSync(file, 'utf8')), {checkAssets, root: process.cwd()}); }
  catch (error) { return {ok: false, errors: [error instanceof Error ? error.message : String(error)]}; }
};
