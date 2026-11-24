# Video Conveyor by Maks

Персональная локальная AI-видеостудия под управлением Codex для производства оригинального faceless-контента. Stage 1 реализует минимальный локальный production engine на Remotion и воспроизводимый 30-секундный synthetic vertical slice. Это не production-ready система публикации: настоящая озвучка, художественная owner-приёмка и G7 остаются отдельными gates.

## Принципы

- локальный file-first pipeline без сервера, очередей и базы данных;
- Codex оркестрирует работу, но не подменяет фактические проверки;
- Remotion — основной программный движок после проверки лицензии для фактического режима использования;
- HyperFrames — дополнительный движок, FFmpeg/FFprobe — сборка и техническая проверка;
- ElevenLabs — основной TTS только после локальной настройки ключа и отдельного согласования платного вызова;
- встроенный ImageGen Codex — основной генератор растровой графики при доступности;
- каждый этап G0–G8 имеет отдельные входы, выходы, acceptance criteria и BLOCKED-состояния.

## Статус Stage 0

Подтверждены Windows 11, Ryzen 5 3600, 32 ГБ RAM, GTX 1660 SUPER с 6144 MiB VRAM, FFmpeg/FFprobe 9.0.2 и рабочий NVENC H.264. Встроенный ImageGen успешно создал и сохранил smoke-test PNG. Проектные WFA Skills установлены официальным installer в `.agents/skills/` с manifest.

Не установлены и не выдаются за готовые: Remotion-проект, HyperFrames, GSAP, Three.js, Blender, Manim, Playwright CLI/MCP, ElevenLabs SDK/CLI. Платные вызовы ElevenLabs не выполнялись.

## Навигация

- [Видение](docs/PROJECT_VISION.md)
- [Архитектура](docs/ARCHITECTURE.md)
- [Производственный pipeline G0–G8](docs/PRODUCTION_PIPELINE.md)
- [Quality gates](docs/QUALITY_GATES.md)
- [Toolchain](docs/TOOLCHAIN.md)
- [Окружение](docs/ENVIRONMENT.md)
- [Skills catalog](docs/SKILLS_CATALOG.md)
- [Аудит внешних Skills](docs/research/EXTERNAL_SKILLS_AUDIT.md)
- [Roadmap](docs/ROADMAP.md)
- [ADR 0001](docs/decisions/0001-foundation.md)

## Проверка foundation

```powershell
pwsh -NoProfile -File .\scripts\verify-stage0.ps1
```

Скрипт проверяет обязательные документы, JSON Schema, WFA manifest, уникальность имён Skills, `.gitignore` и типовые секреты. Это механическая проверка Stage 0, а не доказательство runtime-активации Skills, качества видео или release readiness.

## Stage 1: запуск

```powershell
npm ci
npm run fixture
npm run validate
npm test
npm run studio
npm run render
npm run inspect
```

Production создаётся в `workspace/productions/ai-video-studio-demo/`. Итоговый MP4, FFprobe JSON, render logs и contact sheet остаются в gitignored workspace. Входной fixture и synthetic WAV отслеживаются в `templates/fixtures/stage1/` и `public/`.

## Секреты

Скопируйте `.env.example` в локальный `.env` только когда интеграция действительно понадобится. Никогда не коммитьте ключи, cookies, voice samples, приватные исходники или сырые медиа.
