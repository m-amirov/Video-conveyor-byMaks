import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import type {Scene, VideoProps} from '../contracts';
import {AnimatedInfographic,AnimatedTitle,BackgroundEffects,CaptionTrack,EndCard,ImageMotion,LayeredParallax,SceneTransition,TextReveal} from './components';

const SceneContent=({scene}:{scene:Scene})=>{
  if(scene.kind==='end-card') return <EndCard title={scene.title} body={scene.body}/>;
  return <AbsoluteFill><AnimatedTitle title={scene.title} kicker={scene.kind==='hook'?'HOW IT WORKS':`0${['pipeline','infographic','output'].indexOf(scene.kind)+2} / AI STUDIO`}/><TextReveal text={scene.body}/>{scene.kind==='hook'?<ImageMotion/>:scene.kind==='pipeline'?<LayeredParallax/>:scene.kind==='infographic'?<AnimatedInfographic/>:<ImageMotion/>}<SceneTransition/></AbsoluteFill>;
};

export const Video=({production}:VideoProps)=> <AbsoluteFill style={{backgroundColor:production.visual.background}}>
  <BackgroundEffects seed={production.visual.seed} accent={production.visual.accent}/>
  {production.scenes.map((scene)=><Sequence key={scene.id} name={scene.title} from={scene.from} durationInFrames={scene.durationInFrames}><SceneContent scene={scene}/></Sequence>)}
  {production.audioTracks.map((track)=><Audio
    key={track.id}
    name={track.id}
    src={staticFile(track.path.replace(/^public\//,''))}
    from={track.from}
    durationInFrames={track.durationInFrames}
    volume={(frame:number)=>{const fadeIn=Math.min(1,frame/Math.max(1,track.fadeInFrames));const remaining=track.durationInFrames-frame;const fadeOut=Math.min(1,remaining/Math.max(1,track.fadeOutFrames));return track.volume*Math.max(0,Math.min(fadeIn,fadeOut));}}
  />)}
  <CaptionTrack captions={production.captions}/>
</AbsoluteFill>;
