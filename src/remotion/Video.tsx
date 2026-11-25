import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import type {Scene, VideoComposition, VideoProps} from '../contracts';
import {alignmentIntervals, trackVolumeAtFrame} from '../audio';
import {legacyStylePack,resolveStylePack} from '../styles';
import {BackgroundEffects,CaptionTrack,SceneTransition,SceneVisual} from './components';
import {LegacyBackground,LegacyCaptions,LegacyScene} from './legacy-components';
import './fonts';

const SceneContent=({scene,asset,pack,visual,legacy}:{scene:Scene;asset?:string;pack:ReturnType<typeof resolveStylePack>;visual:VideoComposition['visual'];legacy:boolean})=><AbsoluteFill>{legacy?<LegacyScene scene={scene} asset={asset}/>:<><SceneVisual scene={scene} asset={asset} pack={pack}/><SceneTransition type={scene.director?.transition} pack={pack}/></>}</AbsoluteFill>;

export const Video=({production}:VideoProps)=>{const legacy=!production.visual.stylePack;const pack=production.visual.stylePack?resolveStylePack(production.visual.stylePack):legacyStylePack(production.visual);return <AbsoluteFill style={{backgroundColor:pack.colors.background}}>
  {legacy?<LegacyBackground seed={production.visual.seed} accent={production.visual.accent}/>:<BackgroundEffects seed={production.visual.seed} pack={pack}/>}
  {production.scenes.map((scene)=>{const record=production.assets?.find((a)=>a.id===scene.assetRefs[0]);const asset=record?staticFile(record.path.replace(/^public\//,'')):undefined;return <Sequence key={scene.id} name={scene.title} from={scene.from} durationInFrames={scene.durationInFrames}><SceneContent scene={scene} asset={asset} pack={pack} visual={production.visual} legacy={legacy}/></Sequence>;})}
  {production.audioTracks.map((track)=><Sequence key={track.id} name={track.id} from={track.from} durationInFrames={track.durationInFrames}><Audio
    src={staticFile(track.path.replace(/^public\//,''))}
    volume={(frame:number)=>trackVolumeAtFrame(frame+track.from,track,alignmentIntervals(production.narration?.alignment),production.fps)}
  /></Sequence>)}
  {legacy?<LegacyCaptions captions={production.captions}/>:<CaptionTrack captions={production.captions} preset={production.visual.captionPreset??pack.caption} pack={pack} wordLevel={production.narration?.alignment.granularity==='word'} safeZones={production.visual.safeZones}/>}
</AbsoluteFill>};
