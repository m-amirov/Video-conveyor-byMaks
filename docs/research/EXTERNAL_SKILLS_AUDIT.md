# External Skills Audit — 2026-11-24

## Метод

Sources were opened live; Git repositories were shallow-cloned into an OS temp audit directory with no scripts executed. `SKILL.md`, nearby references/assets/scripts, root license/dependency files and risky command/API patterns were inspected. Stars and catalog security scores were treated only as discovery hints.

Decision meanings: `INSTALL` = safe/necessary now; `ADAPT` = useful content but requires a project safety wrapper; `DEFER` = potentially useful after a concrete stage/dependency; `REJECT` = unsuitable as-is.

## Official/vendor sources

### remotion-best-practices and official modular Skills — INSTALL (Stage 1)

- URL/SHA/version: [remotion-dev/skills](https://github.com/remotion-dev/skills) @ `89c8afa3eee9cdd83838ac31979c2ba1384615aa`, Skill `4.0.546`.
- Purpose/compatibility: official Remotion router and references; Agent Skills/Codex-compatible.
- License: no repository license file observed; Remotion runtime itself uses the proprietary Remotion License.
- Dependencies/paid/hardware: Node/Remotion; references can add npm/Python packages; Remotion license may be paid depending on owner/use; Chromium/CPU/GPU render resources.
- Executables/risks: reference includes `npx create-video`, dependency upgrades, render/studio commands and optional map API keys; installing the entire router vendors a large nested reference tree.
- Overlap/checks: supersedes third-party Remotion advice; full tree and command patterns inspected, not executed.
- Stage 1 result: installed project-scope through the official Remotion CLI after the license decision and a repeat audit of upstream SHA `89c8afa3eee9cdd83838ac31979c2ba1384615aa`. The command added 13 Remotion Skills and `skills-lock.json`; existing WFA-managed Skills were preserved. Map/SaaS/API-key and automatic upgrade commands were not executed. Runtime/new-session activation remains a separate gate.

### ElevenLabs text-to-speech / setup-api-key — ADAPT

- URL/SHA: [elevenlabs/skills](https://github.com/elevenlabs/skills) @ `97478d1b23b9a6795f85bf8b6e33a4677fa1f869`; MIT.
- Purpose/compatibility: official TTS, voice selection, SDK examples and secret setup; compatible with Codex.
- Dependencies/paid/hardware: internet, account/key, Python `elevenlabs` or `@elevenlabs/elevenlabs-js`; API use consumes quota/plan, no special local GPU.
- Executables/risks: official onboarding uses `npx @elevenlabs/cli@latest` and may sign in/write a project key; TTS spends credits; some voices require paid tiers.
- Overlap/checks: no WFA faceless voiceover Skill; README, TTS and key setup inspected, no calls made.
- Decision: adapt in Stage 2 with explicit cost approval, no automatic onboarding, environment-only key, actual account voice listing, timestamp/cost receipts and rights gate.

### HyperFrames core Skills — DEFER

- URL/SHA/version: [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) @ `4354b177eee9bbf9295cbf11a6938e2c877f483d`; Apache-2.0.
- Purpose/compatibility: HTML-to-video editor/CLI plus Remotion migration and media Skills; Agent Skills layout supports Codex.
- Dependencies/paid/hardware: large Node monorepo, browser/FFmpeg toolchain; some optional integrations/assets; local render resources.
- Executables/risks: install/build/render commands, registry blocks and large/LFS repository; normal checkout hit Windows long-path/LFS volume, sparse audit succeeded.
- Overlap/checks: overlaps Remotion composition/editing; core Skills enumerated, scripts not run.
- Decision: defer as secondary engine until a Remotion vertical slice identifies a concrete gap.

### openai/skills — DEFER / NO ACTION

- URL/SHA: [openai/skills](https://github.com/openai/skills) @ `49f948faa9258a0c61caceaf225e179651397431`.
- Purpose: official Codex Skills catalog; current checkout did not expose a dedicated faceless-video production Skill.
- Dependencies/paid/risks: package-specific; several official Skills are already supplied by the Codex client. Repository-wide installation would create broad trigger overlap.
- Decision: use built-in official Skills individually when applicable; do not copy the catalog into this project.

## Curated catalogs (discovery only)

### agentskill.sh Codex/video/Remotion pages — REJECT as installer source

- URLs: [Codex](https://agentskill.sh/for/codex), [video producer](https://agentskill.sh/for/video-producer), [Remotion](https://agentskill.sh/for/remotion).
- Purpose: large discovery index with quality/security metadata.
- Risks/checks: catalog pages recommend an executable npm installer; one required page returned transient 503 before a cached search result succeeded. Catalog scores are not source review or license evidence.
- Decision: discovery only; resolve and audit the original repository/version before any install.

### 24fps.dev + 24fps-motion/brief — DEFER

- URL/SHA/license: [24fps catalog](https://24fps.dev/skills), [misbahsy/24fps-skills](https://github.com/misbahsy/24fps-skills) @ `c5855fa5f46f8ccba9cb23c802ab3f6115822b16`, MIT.
- Purpose: search/reference selection and motion briefs from a large motion library.
- Dependencies/paid/hardware: network/search, optional downstream tools; no inherent GPU requirement.
- Scripts/risks: small Skills but results depend on external library content/URLs and do not prove asset rights.
- Decision: defer until Stage 3 reference research; require source/rights validation for every selected reference.

### createmotion.io agent-skills index — REJECT as package

- URL: [motif motion index](https://createmotion.io/ru/resources/agent-skills/).
- Purpose: useful Russian-language comparison of motion/video Skills.
- Decision: research reference only; it is an index/article, not a pinned installable project capability.

## Requested third-party candidates

| Candidate | Source/version/license | Dependencies and paid APIs | Scripts/security/overlap | Decision |
|---|---|---|---|---|
| `affaan-m/video-editing` | [ECC](https://github.com/affaan-m/ECC) @ `4adeee6732a12d1540f49a4d50a38ce8c97f9a53`, MIT | FFmpeg/Remotion; text also routes to ElevenLabs, fal.ai, Descript/CapCut | broad pipeline, paid/API suggestions and overlap with WFA `video-production`; inspected, not executed | ADAPT later; reject as-is |
| `motion-foundations` | same ECC SHA/MIT | React/Next motion guidance | no required GPU; overlaps official Remotion/GSAP design rules | DEFER |
| `motion-advanced` | same ECC SHA/MIT | React/Next, animation libraries | complex gesture/SVG patterns, not video-pipeline ownership | DEFER |
| `manim-video` | same ECC SHA/MIT | Manim + FFmpeg; Manim missing | starter command and asset; no paid API | DEFER until Manim need/install |
| `remotion-video-creation` | same ECC SHA/MIT | Remotion/Node | generic advice duplicates official vendor Skill | REJECT in favor of official Remotion Skill |
| `taste` | same ECC SHA/MIT | Remotion plus fal.ai prompt presets | music-video aesthetic, paid API paths, broad subjective triggers | REJECT as-is; extract no automatic dependency |
| `ckm:banner-design` | [catalog/source pointer](https://agentskill.sh/@nextlevelbuilder/banner-design), catalog 4.0.1; upstream HEAD `f2f7266b07805025421611656045e9b44b41e2eb`; license not verified in bounded audit | image/design tools | generic banner scope, not YouTube thumbnail evidence; catalog reports 2 low findings | REJECT for Stage 0 |
| `storyboard-prompting` | [a5c-ai/babysitter](https://github.com/a5c-ai/babysitter) @ `feb68abe397acc14f32b34984975c48fedba2b33`, MIT | prompt-only; targets Midjourney/DALL-E/Stable Diffusion | no scripts in target Skill; assumes generators that are not approved for this project and lacks provenance gates | ADAPT shot-language ideas to built-in ImageGen later |
| `video-production-quality-audit` | [agentskill entry](https://agentskill.sh/@ferroxlabs/video-production-quality-audit), catalog 4.0.1; source SHA/license unavailable | text audit | 12.5 KB single Skill; score-based verdict can conflict with evidence gates | REJECT until original source/license and evidence model are verifiable |
| `youtube-strategy` | [plugin source](https://github.com/jeremylongshore/claude-code-plugins-plus-skills/tree/main/plugins/productivity/youtube-strategy) @ repo HEAD `0d57af8e0bedeee24b35527a41dcc341f6e72045`; catalog v1.0.0, license not verified | browser research; no paid API proven in bounded audit | 5 Skills/7 commands, Claude-plugin packaging and broad research triggers | ADAPT G0/G1 contracts; do not install plugin as-is |

## Additional high-quality candidates found

### Vidmoat caption-styling and audio-ducking — ADAPT

- URL/SHA: [vidmoat/skills](https://github.com/vidmoat/skills) @ `ec2c2a944a2d4524d4b3affc6af315511946d6b5`.
- License: CC-BY-4.0 text, Apache-2.0 scripts.
- Purpose: local caption safe zones/reading speed and FFmpeg audio ducking/loudness.
- Dependencies: Python 3.8+ standard library, FFmpeg/libass; no paid API or special GPU.
- Checks: Skill, references, evals and scripts enumerated; not executed. Strong fit, but attribution/provenance and project trigger wording must be preserved.
- Decision: adapt/pin in Stage 1–2; candidates for first external project Skills after test fixtures.

### Vidmoat retention-editor / video-essayist — DEFER

Useful YouTube retention and script-led visual heuristics, but several numeric targets are editorial defaults rather than universal acceptance. Use as review guidance only after actual channel format/data exists.

### social-media-skills/remotion-shorts-skill — ADAPT

- URL/SHA/license: [repository](https://github.com/social-media-skills/remotion-shorts-skill) @ `6a09634c4f81cd011568543fac5960083714bfee`, MIT.
- Purpose: local kinetic-text Shorts pipeline.
- Dependencies/risks: Node/Remotion/FFmpeg, templates and scripts; narrow format and dependency setup overlap the planned vertical slice.
- Decision: mine tests/structure after official Remotion setup; do not adopt as the universal pipeline.

## Category gap result

- Adequate candidates found for Remotion, basic motion, captions, audio ducking, Manim and YouTube strategy.
- No single audited Skill covers end-to-end original faceless production with source citations, paid-call approvals, asset provenance, character consistency, exact render QA and publication boundaries.
- HyperFrames, Blender, Three.js/GSAP, sound design, thumbnail and analytics need task-specific evaluation when their first real use case exists; installing broad trigger packs now would increase conflicts without proving capability.
