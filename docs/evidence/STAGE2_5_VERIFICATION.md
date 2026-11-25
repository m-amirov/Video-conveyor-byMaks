# Stage 2.5 verification — Premium Visual Engine

Date: 2026-11-25. Source baseline: local `main` / `origin/main` `39014322a5596cb4002dd85d176430905480e1be`. Stage 2.5 changes remain uncommitted while the independent review is pending.

## Scope and visual recovery

- Local Manrope, Golos Text and Literata bytes are hash-bound and loaded before render; no CDN or system-font dependency is used.
- Three style packs, four caption presets, eight declarative scene types, protected workspace outputs and the style-pack-free Stage 1/2 compatibility renderer are implemented.
- P1-01: whitespace tokens render as separate `whiteSpace: 'pre'` spans. The regression test preserves repeated whitespace across phrase grouping.
- P1-02: captions are phrase-grouped from measured text and are never clipped with `WebkitLineClamp`/hidden overflow. At Studio frame 330 (11.0 s), the full string `Субтитры следуют подтверждённым таймкодам.` is visible in Editorial Motion.
- P1-03: the Editorial Motion title card moved below the explanatory card and uses measured adaptive title sizing. Studio frame 330 and `qa/frames-1080x1920/element-0375.png` show separated title, explanatory copy and caption bounds.

## Canonical render artifacts

All output is gitignored under `workspace/productions/premium-visual-engine-stage2_5/`.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `renders/preview-cinematic-documentary.mp4` | 3,212,338 | `89306fdb5ae605fe7b753c809f3ab74ecede8aa8fe2354fea60bc259c6969a2d` |
| `renders/preview-editorial-motion.mp4` | 1,816,847 | `487dae78d0f1cccbcb67f1abe40342101505a1203a4f0132c0bbbdf1251712eb` |
| `renders/preview-modern-technology.mp4` | 3,703,345 | `28274e4a7923fc572c620546c437785967f8777fb0b82e7a6d3e6dc4ae56a8ba` |
| `renders/premium-visual-engine-showcase.mp4` | 8,919,693 | `cd4a51bea69c4eab4b5c1b381e549c242438c12daf3d0e164816e755d9a64178` |
| `renders/premium-visual-engine-showcase-repeat.mp4` | 8,919,693 | `cd4a51bea69c4eab4b5c1b381e549c242438c12daf3d0e164816e755d9a64178` |

`qa/showcase-repeat.json` is a separate reproducibility receipt: 1,260 frames, 67,048 ms, and `matchesShowcaseSha256: true`.

## Checks

| Check | Status | Evidence |
| --- | --- | --- |
| Typecheck | PASS | `npm run typecheck` |
| Unit and regression tests | PASS | `npm test`: 36/36, including caption phrase/whitespace coverage |
| Diff whitespace | PASS | `git diff --check` |
| Stage 2 smoke | PASS | `npm run smoke` |
| Stage 0 structural verifier | PASS | `pwsh -NoProfile -File .\\scripts\\verify-stage0.ps1` |
| Dependency audit | PASS | `npm audit --audit-level=high`: 0 vulnerabilities |
| Caption/editorial browser layout | PASS, local | Remotion Studio frame 330, 1080×1920; full caption text, word emphasis and non-overlapping card/copy/caption visible |
| 360 px readability | PASS, local | `qa/preview-cinematic-documentary-360.png`, `preview-editorial-motion-360.png`, `preview-modern-technology-360.png` |
| Representative legacy comparison | PASS | frames 75/450/765 in `qa/legacy-comparison-3901432.json`: exact SHA equality with baseline `3901432` |
| Three preview renders | PASS | canonical preview MP4s and `qa/contact-sheet-*.png` |
| Final showcase/contact sheet | PASS, sampling | canonical showcase and `qa/showcase-contact-sheet.png`; contact sheet is not playback acceptance |
| Repeat render | PASS | separate MP4 and `qa/showcase-repeat.json` |
| FFprobe/full decode | PASS | `qa/*-ffprobe.json` and `qa/*-decode.log`; showcase is H.264 High 1080×1920/30 fps, AAC LC stereo 48 kHz, 42.005 s |
| Blackdetect | OBSERVED | `qa/showcase-blackdetect.log`: one 0.2 s black transition at 15.0 s with `d=0.1`; no claim of a zero-black result |
| Audio measurement | OBSERVED | `qa/showcase-ebur128.log`: −26.8 LUFS, −13.2 dBTP; fixture mock audio, Stage 2 two-pass normalization was not changed or invoked |
| Independent native Sol review | APPROVE WITH NOTES P3 | one authorized read-only `wfa_reviewer` task found no P0/P1/P2; future positive component coverage for active-word rendering is recommended |
| Owner playback/listening | BLOCKED | mock narration is not accepted human narration |
| Artistic acceptance | BLOCKED | owner decision required |
| Publication readiness | BLOCKED | owner gates remain separate; exact pushed SHA/CI has not yet been produced |

## Gate result

Implementation commit `314a0620694e4761bc2ad2be7449232abcb732f2` reached `origin/main`. GitHub Actions [run 45551343695](https://github.com/m-amirov/Video-conveyor-byMaks/actions/runs/45551343695) (`Stage 2 checks`) passed on that exact SHA: npm ci, typecheck, tests, audit, fixture, validation and smoke. The only CI annotation is GitHub's upstream Node.js 20 deprecation notice for `actions/checkout@v4` and `actions/setup-node@v4`.

This record does not certify artistic acceptance, owner playback/listening, rights beyond tracked fixture provenance, or publication readiness.
