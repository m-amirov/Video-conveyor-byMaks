# Производственный pipeline G0–G8

Каждая стадия создаёт `stage-record` со статусом `PASS`, `FAIL`, `BLOCKED` или `NOT_RUN`. `PASS` разрешает переход только по критериям конкретной стадии.

## G0 — Research

- **Входы:** channel brief, география/язык, platform scope, research questions.
- **Выходы:** датированный source log, niche map, competitor set, evidence-backed observations, uncertainties.
- **Acceptance:** ссылки/даты/авторы доступны; факты отделены от гипотез; нет копирования чужого формата как идеи.
- **BLOCKED:** нет доступа к источникам; непонятен рынок/язык; источники требуют запрещённой авторизации.

## G1 — Concept

- **Входы:** принятый G0, channel constraints.
- **Выходы:** concept brief, audience promise, hook, format, originality notes, rough cost/risk score.
- **Acceptance:** одна проверяемая идея, ясная ценность, отличие от источников, реалистичный scope.
- **BLOCKED:** плагиат/неясные права; зависимость от неподтверждённого paid API; концепт нельзя реализовать на доступном toolchain.

## G2 — Script

- **Входы:** G1, claims/sources, target duration and tone.
- **Выходы:** versioned script, narration text, citations/claim map, timing estimate.
- **Acceptance:** hook/payoff, логика, факты с источниками, voice-safe text, расчёт длительности.
- **BLOCKED:** непроверяемые ключевые claims; rights/privacy issue; owner decision on tone/claims required.

## G3 — Storyboard

- **Входы:** accepted script, visual language, aspect ratios.
- **Выходы:** shot list with durations, composition, assets, motion, audio/caption cues and continuity.
- **Acceptance:** каждый script beat отображён; суммарный timing согласован; asset needs перечислены; continuity locks заданы.
- **BLOCKED:** отсутствует approved script/art direction; невозможный shot; неразрешённый reference usage.

## G4 — Asset Production

- **Входы:** storyboard, art/voice briefs, rights policy.
- **Выходы:** real image/audio/font files, manifests, provenance, hashes, derivatives.
- **Acceptance:** decodable bytes, dimensions/duration, SHA-256, license/provenance, mechanical QA; artistic review отдельно.
- **BLOCKED:** ImageGen/ElevenLabs/tool недоступен; paid call не согласован; неизвестны права; character identity drift.

## G5 — Editing

- **Входы:** accepted assets, storyboard, engine config.
- **Выходы:** editable project, deterministic render command, candidate master, render log.
- **Acceptance:** project loads; candidate renders; no missing media; timing/audio/captions match contracts.
- **BLOCKED:** Remotion license unresolved; engine/dependency absent; render failure; source assets not accepted.

## G6 — Quality Assurance

- **Входы:** exact candidate master and manifests.
- **Выходы:** FFprobe JSON, checksums, visual/audio/editorial/caption QA, findings and rerun history.
- **Acceptance:** technical spec PASS; full playback/visual review; audible speech; caption bounds/timing; no unresolved P0/P1.
- **BLOCKED:** final bytes inaccessible; reviewer/playback unavailable; rights/asset lineage incomplete.

## G7 — Publication Readiness

- **Входы:** G6 PASS, platform brief.
- **Выходы:** title/description/tags, thumbnail, disclosure/rights checklist, upload-ready package.
- **Acceptance:** metadata truthful; platform specs current; rights and privacy approved; exact hashes recorded.
- **BLOCKED:** publication permission absent; platform facts stale; copyright/voice/license issue; upload not requested.

`G7 PASS` означает готовность пакета, не факт публикации.

## G8 — Analytics

- **Входы:** authorized published video identifiers and dated analytics snapshot.
- **Выходы:** metric snapshot, interpretation, hypotheses, next G0 questions.
- **Acceptance:** metric definitions/time window/source recorded; correlation not called causation; privacy respected.
- **BLOCKED:** analytics access absent; video not published; insufficient observation window; incomparable metrics.
