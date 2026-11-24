import type {Caption, NarrationAlignment} from './contracts';

export const msToStartFrame = (ms: number, fps: number) => Math.floor(ms * fps / 1000);
export const msToEndFrame = (ms: number, fps: number) => Math.ceil(ms * fps / 1000);

export const captionsFromAlignment = (alignment: NarrationAlignment, fps: number, width: number): Caption[] => alignment.items.map((item, index) => ({
  id: `narration-${index + 1}`,
  text: item.text,
  startFrame: msToStartFrame(item.startMs, fps),
  endFrame: msToEndFrame(item.endMs, fps),
  safeBottom: 240,
  maxWidth: Math.min(width - 160, 920),
}));

const stamp = (ms: number, separator: ',' | '.') => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor(ms % 3600000 / 60000);
  const seconds = Math.floor(ms % 60000 / 1000);
  const millis = Math.floor(ms % 1000);
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}${separator}${String(millis).padStart(3,'0')}`;
};
export const alignmentToSrt = (alignment: NarrationAlignment) => alignment.items.map((item, index) => `${index + 1}\n${stamp(item.startMs, ',')} --> ${stamp(item.endMs, ',')}\n${item.text}`).join('\n\n') + '\n';
export const alignmentToVtt = (alignment: NarrationAlignment) => `WEBVTT\n\n${alignment.items.map((item) => `${stamp(item.startMs, '.')} --> ${stamp(item.endMs, '.')}\n${item.text}`).join('\n\n')}\n`;
