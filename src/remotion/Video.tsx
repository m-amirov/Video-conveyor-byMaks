import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import type {Scene, VideoProps} from '../contracts';
import {alignmentIntervals, trackVolumeAtFrame} from '../audio';
import {AnimatedInfographic,AnimatedTitle,BackgroundEffects,CaptionTrack,EndCard,ImageMotion,LayeredParallax,SceneTransition,TextReveal} from './components';

const SceneContent=({scene,asset}:{scene:Scene;asset?:string})=>{
  if(scene.kind==='end-card') return <EndCard title={scene.title} body={scene.body}/>;
  return <AbsoluteFill><AnimatedTitle title={scene.title} kicker={scene.kind==='hook'?'HOW IT WORKS':`0${['pipeline','infographic','output'].indexOf(scene.kind)+2} / AI STUDIO`}/><TextReveal text={scene.body}/>{asset?<ImageMotion src={asset}/>:scene.kind==='pipeline'?<LayeredParallax/>:scene.kind==='infographic'?<AnimatedInfographic/>:<ImageMotion/>}<SceneTransition/></AbsoluteFill>;
};

export const Video=({production}:VideoProps)=> <AbsoluteFill style={{backgroundColor:production.visual.background}}>
  <BackgroundEffects seed={production.visual.seed} accent={production.visual.accent}/>
  {production.scenes.map((scene)=>{const record=production.assets?.find((a)=>a.id===scene.assetRefs[0]);const asset=record?staticFile(record.path.replace(/^public\//,'')):undefined;return <Sequence key={scene.id} name={scene.title} from={scene.from} durationInFrames={scene.durationInFrames}><SceneContent scene={scene} asset={asset}/></Sequence>;})}
  {production.audioTracks.map((track)=><Sequence key={track.id} name={track.id} from={track.from} durationInFrames={track.durationInFrames}><Audio
    src={staticFile(track.path.replace(/^public\//,''))}
    volume={(frame:number)=>trackVolumeAtFrame(frame+track.from,track,alignmentIntervals(production.narration?.alignment),production.fps)}
  /></Sequence>)}
  <CaptionTrack captions={production.captions}/>
</AbsoluteFill>;
