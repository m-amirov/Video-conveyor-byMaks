# Premium Visual Engine

## Contract

Stage 2.5 extends schema v2 without invalidating Stage 1/2 fixtures. New fields are optional: `visual.stylePack`, `visual.captionPreset`, `visual.safeZones` and `scene.director`. Input remains declarative JSON; no source strings are evaluated as code.

`scene.director.shotType` selects one of eight scene components: `full-bleed-cinematic`, `kinetic-typography`, `editorial-collage`, `layered-parallax`, `macro-detail`, `data-story`, `split-comparison`, `animated-diagram`. Camera, focal point, placement, transition, semantic cues, keyframes and numeric data are bounded by JSON Schema. DataStory rejects an empty data array and never supplies demo numbers itself.

## Style packs

- `cinematic-documentary`: deep neutral palette, restrained gold, full-bleed depth, film wipe and cinematic captions without a card.
- `editorial-motion`: cream paper, hard collage geometry, Literata accents, paper slide and asymmetric editorial captions.
- `modern-technology`: dark precision grid, green data accent, controlled glow, grid reveal and ruled data captions.

Add a style by extending `StylePackId`, the schema enum and `stylePacks` in `src/styles.ts`. Define hierarchy, palette, transition, motion curve and effects together; changing only colors is not a valid new pack. Add a fixture frame and a regression assertion proving structural distinction.

## Captions and semantic motion

Presets are `cinematic`, `kinetic`, `editorial` and `data-driven`. Layout reserves two lines, derives size from text length and available width, and keeps highlighting inline so glyph positions do not jump. Word-by-word highlighting is enabled only when `narration.alignment.granularity` is `word` and every alignment item is exactly one non-whitespace token; segment alignment may emphasize authored phrases but never invents word timestamps. SRT/VTT export remains alignment-driven.

Semantic cues use scene-local frames and validated targets. They can reveal, emphasize, animate a number or advance a diagram. Cues outside scene duration fail validation. All motion is seeded or frame-driven through Remotion APIs; CSS transitions and random runtime state are not used.

## Verification workflow

Run `npm run stage2.5:frames` before video renders, inspect 1080×1920 frames and 360 px previews, then run `npm run stage2.5:previews`, `npm run stage2.5:showcase` and `npm run stage2.5:inspect`. Contact sheets are sampling evidence, not playback acceptance. The fixture uses mock narration; narration quality and owner listening remain blocked.
