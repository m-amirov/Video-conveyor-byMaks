export type SceneKind = 'hook' | 'pipeline' | 'infographic' | 'output' | 'end-card';
export type Scene = {id: string; kind: SceneKind; from: number; durationInFrames: number; title: string; body: string; assetRefs: string[]; animation: {preset: 'impact' | 'reveal' | 'orbit' | 'parallax' | 'resolve'; intensity: number}};
export type AudioTrack = {id: string; path: string; from: number; durationInFrames: number; volume: number; fadeInFrames: number; fadeOutFrames: number; kind: 'synthetic-bed' | 'voiceover'};
export type Caption = {id: string; text: string; startFrame: number; endFrame: number; safeBottom: number; maxWidth: number};
export type VideoComposition = {
  schemaVersion: 1; productionId: string; width: number; height: number; fps: number; durationInFrames: number;
  scenes: Scene[]; audioTracks: AudioTrack[]; captions: Caption[];
  visual: {background: string; primary: string; accent: string; seed: number};
  provenance: Array<{asset: string; source: string; rights: 'repository-authored' | 'owner-provided'}>;
};
export type VideoProps = {production: VideoComposition};
