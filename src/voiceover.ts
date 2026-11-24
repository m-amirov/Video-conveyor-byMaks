import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {NarrationAlignment, NarrationRequest} from './contracts';

export type GenerationReceipt = {provider: string; fingerprint: string; audioPath: string; audioSha256: string; alignmentPath: string; cacheHit: boolean; generatedAt: string; billedCharacters: number};
export const sha256Buffer = (value: Buffer | string) => crypto.createHash('sha256').update(value).digest('hex');
export const fingerprintRequest = (request: Omit<NarrationRequest, 'requestFingerprint' | 'estimatedCharacters'>) => sha256Buffer(JSON.stringify(request));

const wordsFromProviderAlignment=(characters:string[],starts:number[],ends:number[])=>{const items:NarrationAlignment['items']=[];let text='',start=0,end=0;for(let i=0;i<characters.length;i++){const char=characters[i];if(!text)start=Math.floor(starts[i]*1000);text+=char;end=Math.ceil(ends[i]*1000);if(/\s/.test(char)||/[.!?…]/.test(char)||text.length>=80){if(text.trim())items.push({text:text.trim(),startMs:start,endMs:end,source:'provider-native'});text='';}}if(text.trim())items.push({text:text.trim(),startMs:start,endMs:end,source:'provider-native'});return items;};

export const assertPaidGenerationAllowed = (request: NarrationRequest, approved: boolean, apiKeyPresent: boolean) => {
  if (request.provider !== 'elevenlabs') return;
  if (!approved) throw new Error('BLOCKED: ElevenLabs generation requires explicit approval');
  if (request.estimatedCharacters > request.maxApprovedCharacters) throw new Error(`BLOCKED: estimated usage ${request.estimatedCharacters} exceeds approved maximum ${request.maxApprovedCharacters}`);
  if (!apiKeyPresent) throw new Error('BLOCKED: ELEVENLABS_API_KEY is not available');
};

export const generateElevenLabs = async (request: NarrationRequest, outputDir: string, approved: boolean): Promise<GenerationReceipt> => {
  assertPaidGenerationAllowed(request, approved, Boolean(process.env.ELEVENLABS_API_KEY));
  const {requestFingerprint,estimatedCharacters,...fingerprintFields}=request;
  if(fingerprintRequest(fingerprintFields)!==requestFingerprint)throw new Error('BLOCKED: request fingerprint does not match generation parameters');
  if(!request.outputFormat.startsWith('mp3_'))throw new Error('BLOCKED: Stage 2 cache supports only MP3 ElevenLabs output formats');
  fs.mkdirSync(outputDir, {recursive: true});
  const receiptFile = path.join(outputDir, `${request.requestFingerprint}.receipt.json`);
  if (fs.existsSync(receiptFile)) {
    const receipt = JSON.parse(fs.readFileSync(receiptFile, 'utf8')) as GenerationReceipt;
    if (fs.existsSync(receipt.audioPath) && sha256Buffer(fs.readFileSync(receipt.audioPath)) === receipt.audioSha256) return {...receipt, cacheHit: true};
  }
  const lockFile=path.join(outputDir,`${request.requestFingerprint}.lock`);
  let lock:number;
  try{lock=fs.openSync(lockFile,'wx');}catch{throw new Error('BLOCKED: generation for this fingerprint is already in progress');}
  try{
  const {ElevenLabsClient} = await import('@elevenlabs/elevenlabs-js');
  const client = new ElevenLabsClient({apiKey: process.env.ELEVENLABS_API_KEY,maxRetries:0});
  const response = await client.textToSpeech.convertWithTimestamps(request.voiceId, {text: request.text, modelId: request.modelId, languageCode:request.language, outputFormat: request.outputFormat as never},{maxRetries:0});
  if (!response.alignment?.characterEndTimesSeconds.length) throw new Error('ElevenLabs response did not include native alignment');
  const audio = Buffer.from(response.audioBase64, 'base64');
  const audioPath = path.resolve(outputDir, `${request.requestFingerprint}.mp3`);
  fs.writeFileSync(audioPath, audio);
  const durationMs=Math.ceil(Math.max(...response.alignment.characterEndTimesSeconds) * 1000);
  const alignment: NarrationAlignment = {text: request.text, audioSha256: sha256Buffer(audio), audioDurationMs: durationMs, method: 'provider-native', granularity: 'word', items: wordsFromProviderAlignment(response.alignment.characters,response.alignment.characterStartTimesSeconds,response.alignment.characterEndTimesSeconds)};
  const alignmentPath = path.resolve(outputDir, `${request.requestFingerprint}.alignment.json`);
  fs.writeFileSync(alignmentPath, JSON.stringify(alignment, null, 2));
  const receipt: GenerationReceipt = {provider: 'elevenlabs', fingerprint: request.requestFingerprint, audioPath, audioSha256: alignment.audioSha256, alignmentPath, cacheHit: false, generatedAt: new Date().toISOString(), billedCharacters: request.estimatedCharacters};
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2));
  return receipt;
  }finally{fs.closeSync(lock!);fs.unlinkSync(lockFile);}
};
