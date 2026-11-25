import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import type {ErrorObject} from 'ajv';
import type {VideoComposition} from './contracts';
import {fontManifest} from './typography';

export type ValidationResult = {ok: true; value: VideoComposition} | {ok: false; errors: string[]};
const schemaPath = path.resolve('schemas/video-composition.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')) as object;
const require=createRequire(import.meta.url);
const Ajv2020=require('ajv/dist/2020').default as new (options: object) => {compile<T>(schema: object): ((data: unknown) => data is T) & {errors?: ErrorObject[] | null}};
const addFormats=require('ajv-formats').default as (ajv: object)=>void;
const ajv = new Ajv2020({allErrors: true, strict: true});
addFormats(ajv);
const validateSchema = ajv.compile<VideoComposition>(schema);

export const unsafePath = (value: string) => value.includes('\\') || path.isAbsolute(value) || /^[a-z]:/i.test(value) || /^[/\\]{2}/.test(value) || value.split(/[\\/]/).includes('..') || /(^|[\\/])(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|[\\/]|$)/i.test(value);
const inside = (root: string, candidate: string) => {const relative=path.relative(root,candidate);return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));};
export const resolveSafeAsset = (root: string, value: string) => {
  if (unsafePath(value)) return null;
  const normalized=value.replaceAll('\\','/');
  if(!normalized.startsWith('public/'))return null;
  const rootReal=fs.realpathSync(root);
  const publicReal=fs.realpathSync(path.join(rootReal,'public'));
  const candidate=path.resolve(rootReal,normalized);
  if (!inside(publicReal,candidate) || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) return null;
  const real=fs.realpathSync(candidate);
  return inside(publicReal,real) ? real : null;
};

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
    for (const keyframe of scene.director?.keyframes ?? []) if (keyframe.frame >= scene.durationInFrames) errors.push(`scene ${scene.id} keyframe exceeds scene duration`);
    for (const cue of scene.director?.semanticCues ?? []) {if (cue.frame >= scene.durationInFrames) errors.push(`scene ${scene.id} semantic cue exceeds scene duration`);const targets=new Set(['camera','title',...(scene.title.split(/\s+/).map(word=>word.toLowerCase())),...(scene.title.split(/\s+/).map(word=>`word:${word.toLowerCase()}`)),...(scene.director?.data??[]).map(item=>`data:${item.label}`)]);if(!targets.has(cue.target)&&scene.director?.shotType!=='animated-diagram')errors.push(`scene ${scene.id} semantic cue has unknown target: ${cue.target}`);if(cue.type==='number'&&!cue.target.startsWith('data:'))errors.push(`scene ${scene.id} number cue requires data target`);}
    if (scene.director?.shotType === 'data-story' && !(scene.director.data?.length)) errors.push(`scene ${scene.id} data-story requires composition data`);
  }
  if (expectedFrom !== value.durationInFrames) errors.push(`scene total ${expectedFrom} does not equal duration ${value.durationInFrames}`);
  const captionIds=new Set<string>();
  for (const caption of value.captions) {
    if(captionIds.has(caption.id)) errors.push(`duplicate caption id: ${caption.id}`);captionIds.add(caption.id);
    if (caption.endFrame <= caption.startFrame) errors.push(`caption ${caption.id} has invalid timing`);
    if (caption.endFrame > value.durationInFrames) errors.push(`caption ${caption.id} exceeds composition`);
    if (caption.safeBottom < 180 || caption.maxWidth > value.width - 120) errors.push(`caption ${caption.id} violates safe zone`);
    const zones=value.visual.safeZones;if(zones&&(caption.safeBottom<zones.bottom||caption.maxWidth>value.width-zones.left-zones.right))errors.push(`caption ${caption.id} violates configured safe zones`);
  }
  const audioIds=new Set<string>();
  for (const audio of value.audioTracks) {
    if(audioIds.has(audio.id)) errors.push(`duplicate audio id: ${audio.id}`);audioIds.add(audio.id);
    if (audio.from + audio.durationInFrames > value.durationInFrames) errors.push(`audio ${audio.id} exceeds composition`);
    if (audio.fadeInFrames + audio.fadeOutFrames > audio.durationInFrames) errors.push(`audio ${audio.id} fades exceed duration`);
  }
  if(!value.audioTracks.some((audio)=>audio.volume>0))errors.push('at least one audible audio track is required');
  const assetIds=new Set(value.assets?.map((asset)=>asset.id) ?? []);
  for(const scene of value.scenes) for(const ref of scene.assetRefs) if(value.assets && !assetIds.has(ref)) errors.push(`scene ${scene.id} references missing asset id: ${ref}`);
  const assetPaths = [...value.audioTracks.map((a) => a.path), ...(value.assets?.map((a)=>a.path) ?? value.scenes.flatMap((s) => s.assetRefs)), ...value.provenance.map((p) => p.asset)];
  for (const asset of assetPaths) {
    if (unsafePath(asset)) errors.push(`unsafe path: ${asset}`);
    if (options.checkAssets && !resolveSafeAsset(options.root ?? process.cwd(),asset)) errors.push(`missing asset or escaped root: ${asset}`);
  }
  if(value.assets){const seen=new Set<string>();for(const asset of value.assets){if(seen.has(asset.id))errors.push(`duplicate asset id: ${asset.id}`);seen.add(asset.id);if(options.checkAssets){const file=resolveSafeAsset(options.root ?? process.cwd(),asset.path);if(file){const digest=(awaitImportHash(fs.readFileSync(file)));if(digest!==asset.sha256)errors.push(`asset ${asset.id} sha256 mismatch`);}}}}
  if(value.narration){const a=value.narration.alignment;if(a.audioDurationMs<=0)errors.push('narration audio duration must be positive');let previous=0;let combined='';for(const item of a.items){if(item.startMs<previous||item.endMs<=item.startMs)errors.push(`invalid narration interval: ${item.text}`);if(a.granularity==='word'&&!/^\S+$/u.test(item.text))errors.push(`word alignment item must contain exactly one word: ${item.text}`);if(item.endMs>a.audioDurationMs)errors.push(`narration interval exceeds audio: ${item.text}`);if(item.confidence!==undefined&&(item.confidence<0||item.confidence>1))errors.push(`invalid narration confidence: ${item.text}`);previous=item.endMs;combined+=` ${item.text}`;}if(combined.trim().replace(/\s+/g,' ')!==a.text.trim().replace(/\s+/g,' '))errors.push('narration alignment text mismatch');}
  if(value.narration){const request=value.narration.request;if(request.estimatedCharacters!==request.text.length)errors.push('narration estimatedCharacters mismatch');const {requestFingerprint,estimatedCharacters,...fingerprintFields}=request;const expectedFingerprint=awaitImportHash(Buffer.from(JSON.stringify(fingerprintFields)));if(requestFingerprint!==expectedFingerprint)errors.push('narration request fingerprint mismatch');const voices=value.audioTracks.filter((track)=>track.kind==='voiceover');if(voices.length!==1)errors.push('narration requires exactly one voiceover track');const voice=voices[0];if(voice&&(voice.from!==0||voice.durationInFrames<Math.ceil(value.narration.alignment.audioDurationMs*value.fps/1000)))errors.push('voiceover track does not cover narration alignment');if(options.checkAssets&&voice){const file=resolveSafeAsset(options.root??process.cwd(),voice.path);if(file&&awaitImportHash(fs.readFileSync(file))!==value.narration.alignment.audioSha256)errors.push('narration audio sha256 mismatch');}for(let i=0;i<value.narration.alignment.items.length;i++){const item=value.narration.alignment.items[i],caption=value.captions[i];if(!caption||caption.text!==item.text||caption.startFrame!==Math.floor(item.startMs*value.fps/1000)||caption.endFrame!==Math.ceil(item.endMs*value.fps/1000))errors.push(`caption ${i+1} does not match narration alignment`);}}
  if(options.checkAssets){for(const font of fontManifest){const file=resolveSafeAsset(options.root??process.cwd(),`public/${font.path}`);if(!file)errors.push(`missing font: ${font.family}`);else if(awaitImportHash(fs.readFileSync(file))!==font.sha256)errors.push(`font ${font.family} sha256 mismatch`);}}
  return errors.length ? {ok: false, errors} : {ok: true, value};
};

const awaitImportHash=(data:Buffer)=>{const require=createRequire(import.meta.url);const crypto=require('node:crypto') as typeof import('node:crypto');return crypto.createHash('sha256').update(data).digest('hex');};

export const loadAndValidateProduction = (file: string, checkAssets = true): ValidationResult => {
  try { return validateProduction(JSON.parse(fs.readFileSync(file, 'utf8')), {checkAssets, root: process.cwd()}); }
  catch (error) { return {ok: false, errors: [error instanceof Error ? error.message : String(error)]}; }
};
