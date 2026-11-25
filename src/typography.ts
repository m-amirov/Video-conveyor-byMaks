export const fontFamilies = {
  display: 'Manrope',
  text: 'Golos Text',
  editorial: 'Literata',
} as const;

export const typography = {
  hook: {min: 100, max: 144, lineHeight: 0.94, letterSpacing: -4, maxLines: 3},
  sceneTitle: {min: 72, max: 100, lineHeight: 0.98, letterSpacing: -2.5, maxLines: 3},
  caption: {min: 58, max: 76, lineHeight: 1.08, letterSpacing: -0.8, maxLines: 2},
  emphasis: {min: 80, max: 120, lineHeight: 0.96, letterSpacing: -3, maxLines: 3},
  body: {min: 42, max: 52, lineHeight: 1.25, letterSpacing: -0.4, maxLines: 4},
} as const;

export const fitText = (text: string, maxWidth: number, maxLines: number, min: number, max: number) => {
  const units=(word:string)=>[...word].reduce((sum, char) => sum + (/\s/.test(char) ? 0.32 : /[MWЖШЩФ@%]/i.test(char) ? 0.9 : /[A-ZА-ЯЁ]/.test(char) ? 0.75 : 0.6), 0);
  const glyphUnits=units(text);
  const longestWord=Math.max(...text.split(/\s+/).map(units),1);
  const size = Math.floor(Math.min(max,maxWidth / longestWord,Math.max(min, maxWidth * maxLines / Math.max(glyphUnits, 1))));
  return {fontSize: size, maxLines};
};

export const measureTextFit = (text: string, maxWidth: number, maxLines: number, min: number, max: number, family: string, weight: number) => {
  if (typeof document === 'undefined') return fitText(text,maxWidth,maxLines,min,max);
  const context=document.createElement('canvas').getContext('2d');
  if (!context) return fitText(text,maxWidth,maxLines,min,max);
  for(let size=max;size>=min;size--){context.font=`${weight} ${size}px "${family}"`;let lines=1;let current='';for(const word of text.split(/\s+/)){const next=current?`${current} ${word}`:word;if(context.measureText(next).width<=maxWidth)current=next;else{lines++;current=word;}}if(lines<=maxLines&&context.measureText(current).width<=maxWidth)return {fontSize:size,maxLines};}
  return {fontSize:min,maxLines};
};

const textWidth = (text: string, size: number, family: string, weight: number) => {
  if (typeof document === 'undefined') return fitText(text, Number.MAX_SAFE_INTEGER, 1, size, size).fontSize === size ? [...text].length * size * .6 : 0;
  const context=document.createElement('canvas').getContext('2d');
  if (!context) return [...text].length * size * .6;
  context.font=`${weight} ${size}px "${family}"`;
  return context.measureText(text).width;
};

export const groupCaptionPhrases = (text: string, maxWidth: number, maxLines: number, size: number, family: string, weight: number) => {
  const phrases=text.match(/[^,.;:!?]+[,.;:!?]?\s*/gu) ?? [text];
  const lines:string[]=[];
  let current='';
  for(const phrase of phrases){
    const next=`${current}${phrase}`;
    if(current&&textWidth(next,size,family,weight)>maxWidth){lines.push(current);current=phrase;}
    else current=next;
  }
  if(current) lines.push(current);
  if(lines.length<=maxLines) return lines;
  const words=text.match(/\S+\s*/gu) ?? [text];
  const wrapped:string[]=[];
  current='';
  for(const word of words){
    const next=`${current}${word}`;
    if(current&&textWidth(next,size,family,weight)>maxWidth){wrapped.push(current);current=word;}
    else current=next;
  }
  if(current) wrapped.push(current);
  return wrapped;
};

export const fontManifest = [
  {family: 'Manrope', path: 'fonts/manrope/Manrope-wght.ttf', weight: '200 800', sha256: '3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6'},
  {family: 'Golos Text', path: 'fonts/golos-text/GolosText-wght.ttf', weight: '400 900', sha256: '17bb58fb69aec2dfb047a2ebf52534023e9b688c97a6b7ac795b0a72912c2063'},
  {family: 'Literata', path: 'fonts/literata/Literata-opsz-wght.ttf', weight: '200 900', sha256: 'b41138c9373112f32abb589cc22e8674b06ed4048b0c513be922bdd26f274440'},
] as const;
