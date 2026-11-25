import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {fontManifest} from '../typography';

export const fontLoads = Promise.all(fontManifest.map((font) => loadFont({
  family: font.family,
  url: staticFile(font.path),
  format: 'truetype',
  weight: font.weight,
  display: 'block',
})));
