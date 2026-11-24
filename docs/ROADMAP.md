# Roadmap

## Stage 0 — Foundation (завершён как baseline)

- environment/Git evidence;
- WFA project Skills и manifest;
- external Skills audit;
- file-first architecture, G0–G8, quality gates;
- safe `.env.example`/`.gitignore`;
- ImageGen smoke-test;
- Stage 1 execution plan.

Stage 0 не реализует production editor. Независимый review контрактов и verifier выполнен в рамках foundation, но архитектурный owner-review продукта остаётся отдельным gate и не подменяется mechanical PASS.

## Stage 1 — First deterministic vertical slice

1. Подтвердить Remotion license eligibility для персонального automation use.
2. Создать pinned Node/TypeScript workspace и lockfile.
3. Реализовать JSON Schema validation и локальный CLI для production/stage records.
4. Собрать одну 20–40 секундную synthetic faceless composition без paid API.
5. Добавить FFprobe/hash/decode checks и caption-safe test.
6. Провести desktop render review и сохранить evidence.

**Definition of Done:** один воспроизводимый локальный MP4 из repository-owned synthetic inputs; exact command, source SHA, lockfile, FFprobe, hash и manual review. ElevenLabs остаётся mocked/local silence или owner-provided recording до отдельного approval.

Статус: engineering slice реализован; technical render/FFprobe/decode/contact-sheet gates пройдены локально. Полный owner playback/listening и художественная приёмка остаются BLOCKED до ручного подтверждения владельца. Детали: [Stage 1 verification](evidence/STAGE1_VERIFICATION.md).

## Stage 2 — Narration and assets

- ElevenLabs SDK integration with explicit cost gate and timestamps;
- Faster Whisper fallback and subtitle contract;
- ImageGen asset manifest/provenance;
- audio ducking and loudness validation.

## Stage 3 — Research-to-storyboard

- cited niche/competitor research packets;
- idea scoring and originality gates;
- script/claim mapping;
- storyboard CLI and review views.

## Stage 4 — Reusable production system

- reusable Remotion scenes/components;
- optional HyperFrames adapters;
- GSAP/Three.js/Manim/Blender only per proven need;
- analytics feedback into G0.

## Deferred

Web UI, remote workers, DB/queue, automated publishing and heavy local generative models require separate evidence and decision.
