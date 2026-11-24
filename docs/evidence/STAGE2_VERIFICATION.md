# Stage 2 verification

Дата проверки: 2026-11-24. Baseline: `ff4beca931e64adcb91fe89a1b579b9b451c199c`.

## Реализованный scope

- Зафиксирован официальный `@elevenlabs/elevenlabs-js` 2.79.0. Adapter использует `ELEVENLABS_API_KEY` только во время явного вызова, native timestamp endpoint, fingerprint/cache receipt и три fail-closed gate: отдельный approval, достаточный character limit и наличие key.
- Добавлены provider contracts `elevenlabs | local | mock`; платный API не вызывался. Демонстрация использует repository-authored deterministic mock audio, не человеческую речь.
- Alignment contract хранит source, granularity, audio SHA-256, duration и optional confidence. Captions детерминированно строятся через floor(start)/ceil(end), экспортируются в SRT/VTT; semantic validator сверяет caption text/timing с alignment.
- Asset manifest содержит immutable ID, безопасный относительный путь, SHA-256, dimensions, MIME, provenance, rights и revision. Разрешены только `public/` и `templates/fixtures/`; absolute, drive-relative, UNC, traversal и symlink/junction escapes отклоняются.
- `assetRefs` реально выбирают SVG в Remotion. Voiceover/music tracks имеют локальные fades; music ducking следует подтверждённым speech intervals.
- Master использует двухпроходный FFmpeg loudnorm, AAC stereo 48 kHz и H.264 yuv420p.

Официальные источники: [Node SDK](https://github.com/elevenlabs/elevenlabs-js), [models](https://elevenlabs.io/docs/overview/models/), [stream with timestamps](https://elevenlabs.io/docs/api-reference/text-to-speech/stream-with-timestamps/), [pricing](https://elevenlabs.io/pricing/api).

## Артефакт

- MP4: `D:\HardWork\Vido\Video-conveyor-byMaks\workspace\productions\ai-video-studio-stage2\renders\ai-video-studio-stage2.mp4`
- Размер: 12,246,617 bytes.
- SHA-256: `446504a391344ce109c8a093e34dc10391b7ab4696198bfd8d08c678f43c6099`.
- Render: 109,635 ms; repeat: 110,099 ms; concurrency 2.
- Repeat render SHA-256 совпал с первым финальным render.
- FFprobe: H.264 High, 1080×1920, 30/1 FPS, 1080 frames, video 36.000 s; AAC LC stereo 48 kHz; MP4 duration 36.100 s; yuv420p.
- Loudness: −13.97 LUFS integrated; true peak −1.09 dBTP; LRA 8.80 LU.
- FFprobe JSON: `workspace/productions/ai-video-studio-stage2/qa/ffprobe.json`.
- Render/normalize logs: `workspace/productions/ai-video-studio-stage2/qa/`.
- Contact sheet: `workspace/productions/ai-video-studio-stage2/qa/contact-sheet.png`.
- SRT/VTT: `workspace/productions/ai-video-studio-stage2/captions.srt` и `captions.vtt`.

## Фактически выполненные проверки

| Проверка | Статус | Результат |
| --- | --- | --- |
| `npm run typecheck` | PASS | TypeScript без ошибок |
| `npm test` | PASS | 23/23, positive и negative cases |
| `npm run fixture` / `npm run validate` | PASS | schema + semantic + assets |
| `npm run smoke` | PASS | 90 кадров, CPU render |
| `npm run render` | PASS | полный 36 s master |
| repeat `npm run render -- --repeat` | PASS | тот же SHA-256 |
| `npm run inspect` | PASS | FFprobe, full decode, blackdetect, loudnorm, contact sheet |
| `npm audit --audit-level=high` | PASS | 0 vulnerabilities |
| `scripts/verify-stage0.ps1` | PASS | foundation guarantees сохранены |
| Remotion compositions/Studio bundle | PASS | обе композиции обнаружены |
| Contact-sheet visual review | PASS | ассеты, scene boundaries, captions; title collision исправлен и перепроверен |
| Full owner playback/listening | BLOCKED | требуется владелец |
| Human narration | BLOCKED | нет approved ElevenLabs call или owner-provided WAV/MP3 |
| Faster Whisper runtime | NOT RUN | пакет/CLI локально отсутствует; contract source поддержан |
| Paid ElevenLabs generation | BLOCKED | approval отсутствует; расход 0 |
| CI exact commit | NOT RUN | заполняется после push exact SHA |

Full decode завершился exit 0. Blackdetect не сообщил интервалов black scene. Contact sheet включает середины сцен и переходные границы; переходные gradient wipes не классифицировались как пропавшие сцены.

## Review и Skills evidence

- Luna explorer invocation (`gpt-6-luna`, low) обнаружил carry-over дефекты path containment, audio offset fade и неиспользуемые `assetRefs`; исправлены с regression coverage. Usage: 54,325 input, 23,680 cached, 1,055 output tokens.
- Positive Remotion Skill activation: PASS; новая Luna session прочитала `.agents/skills/remotion-best-practices/SKILL.md` и `src/remotion/Video.tsx`, сохранив path/hash/line evidence. Usage: 87,155 input, 25,600 cached, 954 output tokens. Negative activation eval не запускался после этого объёма, чтобы не расходовать дополнительный лимит.
- Первый GPT-6.2 Web Medium reviewer не получил local Full harness (BLOCKED_EXTERNAL; 25,740 input, 234 output). Повторный локальный GPT-6.2 Sol review состоялся и обнаружил P1/P2 defects: Chromium dotenv exposure, stale fingerprint/cache, SDK retries/concurrency, voiceover alignment/path/metadata/asset mapping/output format/silent mix. Все findings устранены; bounded re-review подтвердил RESOLVED и указал два оставшихся P2 (документация env и несколько asset refs), также исправленных. Resume выполнялся host fallback-моделью GPT-5.6 Sol, поэтому model-route drift зафиксирован, а не скрыт.
- Root visual review исправил фактический title overlap и one-pass loudness miss; это не заменяет owner artistic acceptance.

Подробные JSONL receipts находятся в gitignored `workspace/stage2/evidence/`.

## Gates

- Engineering acceptance: PASS локально.
- Voiceover provider integration: PASS (adapter/negative gates), live provider call BLOCKED.
- Timestamp correctness: PASS для mock-provider contract; provider-native live response NOT RUN; Faster Whisper NOT RUN.
- Audio technical QA: PASS по измерениям; listening BLOCKED.
- Visual mechanical QA: PASS; owner playback и artistic acceptance BLOCKED.
- Rights: PASS только для repository fixtures; будущие owner/generated assets требуют отдельного receipt.
- Publication readiness: BLOCKED. Видео не публиковалось.
