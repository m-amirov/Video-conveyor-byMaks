import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {validateProduction} from '../src/validation';
import type {VideoComposition} from '../src/contracts';

const fixture=()=>JSON.parse(fs.readFileSync('templates/fixtures/stage1/production.json','utf8')) as VideoComposition;
test('accepts the deterministic Stage 1 fixture',()=>assert.equal(validateProduction(fixture()).ok,true));
test('rejects a gap between scene boundaries',()=>{const v=fixture();v.scenes[1]!.from+=1;const r=validateProduction(v);assert.equal(r.ok,false);assert.match(r.ok?'':r.errors.join('\n'),/must start/);});
test('rejects a scene beyond composition duration',()=>{const v=fixture();v.scenes.at(-1)!.durationInFrames+=1;const r=validateProduction(v);assert.equal(r.ok,false);assert.match(r.ok?'':r.errors.join('\n'),/does not equal duration/);});
test('rejects missing assets',()=>{const v=fixture();v.audioTracks[0]!.path='public/missing.wav';const r=validateProduction(v,{checkAssets:true,root:process.cwd()});assert.equal(r.ok,false);assert.match(r.ok?'':r.errors.join('\n'),/missing asset/);});
test('rejects unsafe paths',()=>{const v=fixture();v.audioTracks[0]!.path='../secret.wav';const r=validateProduction(v);assert.equal(r.ok,false);});
test('rejects invalid caption timing',()=>{const v=fixture();v.captions[0]!.endFrame=v.captions[0]!.startFrame;const r=validateProduction(v);assert.equal(r.ok,false);assert.match(r.ok?'':r.errors.join('\n'),/invalid timing/);});
test('rejects captions outside the safe zone',()=>{const v=fixture();v.captions[0]!.safeBottom=120;const r=validateProduction(v);assert.equal(r.ok,false);assert.match(r.ok?'':r.errors.join('\n'),/safe zone/);});
