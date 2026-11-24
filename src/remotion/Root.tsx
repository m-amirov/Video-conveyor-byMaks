import React from 'react';
import {Composition} from 'remotion';
import fixture from '../../templates/fixtures/stage1/production.json';
import type {VideoComposition} from '../contracts';
import {Video} from './Video';

export const RemotionRoot=()=> <Composition id="AiVideoStudio" component={Video} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{production:fixture as VideoComposition}}/>;
