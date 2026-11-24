export type SceneKind = 'hook' | 'pipeline' | 'infographic' | 'output' | 'end-card';
export type Scene = {id: string; kind: SceneKind; from: number; durationInFrames: number; title: string; body: string; assetRefs: string[]; animation: {preset: 'impact' | 'reveal' | 'orbit' | 'parallax' | 'resolve'; intensity: number}};
export type AudioTrack = {id: string; path: string; from: number; durationInFrames: number; volume: number; fadeInFrames: number; fadeOutFrames: number; kind: 'synthetic-bed' | 'voiceover' | 'music' | 'sfx'};
export type Caption = {id: string; text: string; startFrame: number; endFrame: number; safeBottom: number; maxWidth: number};
export type AssetRecord = {id: string; path: string; sha256: string; width: number; height: number; mediaType: 'image/png' | 'image/jpeg' | 'image/svg+xml'; source: string; provenance: string; rightsStatus: 'repository-authored' | 'owner-provided' | 'generated-approved'; revision: number};
export type AlignmentItem = {text: string; startMs: number; endMs: number; source: 'provider-native' | 'faster-whisper' | 'manual' | 'mock-provider'; confidence?: number};
export type NarrationAlignment = {text: string; audioSha256: string; audioDurationMs: number; method: 'provider-native' | 'faster-whisper' | 'manual' | 'mock-provider'; granularity: 'word' | 'segment'; items: AlignmentItem[]};
export type NarrationRequest = {provider: 'elevenlabs' | 'local' | 'mock'; voiceId: string; modelId: string; language: string; text: string; outputFormat: string; estimatedCharacters: number; maxApprovedCharacters: number; requestFingerprint: string};
export type VideoComposition = {
  schemaVersion: 1 | 2; productionId: string; width: number; height: number; fps: number; durationInFrames: number;
  scenes: Scene[]; audioTracks: AudioTrack[]; captions: Caption[];
  visual: {background: string; primary: string; accent: string; seed: number};
  provenance: Array<{asset: string; source: string; rights: 'repository-authored' | 'owner-provided'}>;
  assets?: AssetRecord[];
  narration?: {request: NarrationRequest; alignment: NarrationAlignment};
};
export type VideoProps = {production: VideoComposition};
