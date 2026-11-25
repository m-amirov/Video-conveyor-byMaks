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

Статус: локальный mock/owner-input pipeline и fail-closed ElevenLabs adapter реализуются без платного вызова. Production voice generation, owner playback и artistic acceptance остаются отдельными gates; Faster Whisper runtime считается доступным только после фактической локальной установки и проверки.

## Stage 2.5 — Premium Visual Engine

Инженерный baseline опубликован; см. [evidence](evidence/STAGE2_5_VERIFICATION.md). Artistic/owner playback и publication readiness отдельны.

## Активный маршрут (решение 2026-11-25)

- Стратегия и аудитория: [Channel Strategy](CHANNEL_STRATEGY.md).
- G0: изучить прямых конкурентов, актуальный спрос и игровые источники; параллельно проверить [ClipHub eligibility](CLIPHUB_MONETIZATION.md).
  - Первичный срез: [конкурентное исследование 2026-11-25](research/GAMING_MOTION_COMICS_COMPETITORS_2026-11-25.md); полные ленты Shorts, фактический playback и ClipHub eligibility остаются непроверенными. G0 не объявлен PASS.
- G1–G3: owner выбрал яркий юмористический формат; [CS2 pilot draft](pilots/CS2_CHICKEN_TRICKS_PILOT.md), [Visual guide v0.2](BRAND_VISUAL_GUIDE.md), [нейминг](CHANNEL_NAMING.md). Fallout отложен; реальный арт, owner approval конкретного пилота, runtime и права остаются отдельными gates.
- G4–G6: создать 1–3 чистых Motion Comic пилота с существующим движком; оценить полный playback, стиль и стоимость.
- G7: отдельное разрешение на публикацию; рекламная ревизия только после подтверждённых правил и прав.
- G8: после разрешённой публикации — тестовая серия до 30 роликов, аналитика и решение о масштабировании.

Stage 3 научный пилот и эксперимент с голубем остаются локальными по отчётам владельца; не объявлять интеграцию, не уничтожать их. Сложные риги и платная видеогенерация отложены. Следующий этап — контент, не новый движок.

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
