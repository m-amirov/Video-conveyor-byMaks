import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 48000;
const seconds = 30;
const samples = sampleRate * seconds;
const data = Buffer.alloc(samples * 2);
const accents = [0, 4, 11, 18, 25];
for (let i = 0; i < samples; i++) {
  const t = i / sampleRate;
  const bed = 0.07 * Math.sin(2 * Math.PI * 110 * t) + 0.035 * Math.sin(2 * Math.PI * 220 * t);
  let pulse = 0;
  for (const at of accents) { const dt = t - at; if (dt >= 0 && dt < 0.28) pulse += 0.22 * Math.exp(-dt * 14) * Math.sin(2 * Math.PI * (520 - dt * 900) * dt); }
  const fade = Math.min(1, t / 1, (seconds - t) / 1.5);
  const value = Math.max(-1, Math.min(1, (bed + pulse) * Math.max(0, fade)));
  data.writeInt16LE(Math.round(value * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + data.length, 4); header.write('WAVEfmt ', 8); header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(data.length, 40);
for (const target of ['templates/fixtures/stage1/synthetic-audio.wav', 'public/synthetic-audio.wav']) {
  fs.mkdirSync(path.dirname(target), {recursive: true}); fs.writeFileSync(target, Buffer.concat([header, data])); console.log(target);
}
