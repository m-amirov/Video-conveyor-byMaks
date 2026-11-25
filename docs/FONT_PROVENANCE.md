# Local font provenance

Stage 2.5 uses only local font bytes under `public/fonts/`. Rendering has no CDN or system-font dependency. All three families are licensed under SIL Open Font License 1.1; the corresponding `OFL.txt` is stored beside each font.

| Family | Runtime role | Official source | Coverage / weights | Local file | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| Manrope | hooks and display | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/manrope) | Cyrillic, Latin; variable 200–800 | `public/fonts/manrope/Manrope-wght.ttf` | `3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6` |
| Golos Text | captions and body | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/golostext) | Cyrillic, Latin; variable 400–900 | `public/fonts/golos-text/GolosText-wght.ttf` | `17bb58fb69aec2dfb047a2ebf52534023e9b688c97a6b7ac795b0a72912c2063` |
| Literata | editorial/documentary text | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/literata) | Cyrillic, Latin; optical size and weight axes | `public/fonts/literata/Literata-opsz-wght.ttf` | `b41138c9373112f32abb589cc22e8674b06ed4048b0c513be922bdd26f274440` |

Runtime loading uses `@remotion/fonts` `loadFont()` with `staticFile()`, `display: block` and explicit variable weight ranges. Stage 2.5's validated render wrapper checks the local SHA-256 before rendering; direct Studio/CLI invocations still fail on a missing local font, but do not claim to run the wrapper's digest check. A font load failure blocks rendering rather than silently accepting a fallback.

Downloaded from `raw.githubusercontent.com/google/fonts/main/ofl/...` on 2026-11-24 after checking the official repositories, OFL license, Cyrillic/Latin coverage and required weights. Font artistic suitability remains part of owner visual acceptance.
