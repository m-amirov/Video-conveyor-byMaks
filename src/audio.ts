import type {AudioTrack, NarrationAlignment} from './contracts';

export const localTrackFrame = (compositionFrame: number, track: AudioTrack) => compositionFrame - track.from;

export const trackVolumeAtFrame = (compositionFrame: number, track: AudioTrack, speechIntervals: Array<[number, number]> = [], fps = 30) => {
  const frame = localTrackFrame(compositionFrame, track);
  if (frame < 0 || frame >= track.durationInFrames) return 0;
  const fadeIn = track.fadeInFrames === 0 ? 1 : Math.min(1, frame / track.fadeInFrames);
  const remaining = track.durationInFrames - frame;
  const fadeOut = track.fadeOutFrames === 0 ? 1 : Math.min(1, remaining / track.fadeOutFrames);
  const speech = speechIntervals.some(([startMs, endMs]) => compositionFrame >= Math.floor(startMs * fps / 1000) && compositionFrame < Math.ceil(endMs * fps / 1000));
  const duck = track.kind === 'music' && speech ? 0.28 : 1;
  return track.volume * Math.max(0, Math.min(fadeIn, fadeOut)) * duck;
};

export const alignmentIntervals = (alignment?: NarrationAlignment): Array<[number, number]> => alignment ? alignment.items.map((item) => [item.startMs, item.endMs]) : [];
