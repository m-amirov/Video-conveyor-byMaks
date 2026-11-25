import React from 'react';
import {Composition} from 'remotion';
import fixture from '../../templates/fixtures/stage1/production.json';
import stage2Fixture from '../../templates/fixtures/stage2/production.json';
import stage25Fixture from '../../templates/fixtures/stage2_5/production.json';
import type {VideoComposition} from '../contracts';
import {Video} from './Video';

const metadata=({props}:{props:{production:VideoComposition}})=>({durationInFrames:props.production.durationInFrames,fps:props.production.fps,width:props.production.width,height:props.production.height});
export const RemotionRoot=()=> <><Composition id="AiVideoStudio" component={Video} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{production:fixture as VideoComposition}} calculateMetadata={metadata}/><Composition id="NarratedAssetDemo" component={Video} durationInFrames={1080} fps={30} width={1080} height={1920} defaultProps={{production:stage2Fixture as VideoComposition}} calculateMetadata={metadata}/><Composition id="PremiumVisualEngine" component={Video} durationInFrames={1260} fps={30} width={1080} height={1920} defaultProps={{production:stage25Fixture as VideoComposition}} calculateMetadata={metadata}/></>;
