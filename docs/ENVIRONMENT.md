# Окружение — 2026-11-24

## Подтверждённое оборудование

| Компонент | Факт | Evidence |
|---|---|---|
| ОС | Windows 11 Pro 64-bit, 10.0.26100 build 26100 | `Win32_OperatingSystem` |
| CPU | AMD Ryzen 5 3600, 6 cores / 12 logical processors | `Win32_Processor` |
| RAM | 33,502,440 KiB visible (~31.95 GiB) | `Win32_OperatingSystem` |
| GPU | NVIDIA GeForce GTX 1660 SUPER | `nvidia-smi`, WMI |
| VRAM | **6144 MiB** | `nvidia-smi --query-gpu=name,memory.total,...` |
| NVIDIA driver | 610.88 | `nvidia-smi` |
| Диски | C: 953.75 GB / 264.81 GB free; D: 463.00 / 401.48; E: 230.87 / 131.76 | `Get-Volume` |

WMI сообщал `AdapterRAM=4,293,918,720` (~4 ГБ), но это известное ограниченное поле. Авторитетный `nvidia-smi` подтверждает штатные 6144 MiB GTX 1660 SUPER.

## Инструменты

| Инструмент | Статус | Версия/путь |
|---|---|---|
| Node.js | PASS | v22.21.0 (`C:\nvm4w\nodejs\node.exe`) |
| npm | PASS | 10.9.4 |
| Python | PASS | 3.13.5 (`python`), launcher default 3.14.2 |
| Git | PASS | 2.53.0.windows.2 |
| Codex CLI | PASS | 0.167.2 |
| FFmpeg / FFprobe | PASS | 9.0.2 full build |
| Faster Whisper | PASS (module discovery) | `faster-whisper 1.2.1`, `ctranslate2 4.7.1`; end-to-end transcription NOT RUN |
| NVIDIA NVENC H.264 | PASS | real 1280x720 one-second encode + FFprobe |
| Blender | BLOCKED | executable missing |
| Manim | BLOCKED | executable/module missing |
| Playwright CLI / Python | BLOCKED | not locally installed; browser capability in host is a separate gate |
| Remotion | BLOCKED | project/dependency absent |
| HyperFrames | BLOCKED | CLI/project absent |
| GSAP / Three.js | BLOCKED | no project dependencies yet |
| ElevenLabs SDK / CLI | BLOCKED | absent; API key/cost approval absent |

FFmpeg lists NVENC/QSV/AMF encoders compiled into the binary. Реальные smoke-тесты: H.264 NVENC PASS, HEVC NVENC PASS, AV1 NVENC FAIL (`No capable devices found`, ожидаемо для GTX 1660 SUPER). Наличие encoder name не доказывает поддержку codec конкретным GPU.

## Git snapshots

- Project start: `main`, no commits, `origin/main` absent, clean worktree.
- Project remote: `https://github.com/m-amirov/Video-conveyor-byMaks.git`.
- WFA checkout: `D:\HardWork\workflow-for-agents`.
- WFA source: clean `main@ebfd0880cedb0f1ebd68ab9821d19fbc64f681fb`, совпал с `origin/main` после fast-forward.

## ImageGen

Built-in ImageGen: `PASS` capability smoke. Создан `docs/evidence/imagegen-smoke-test.png`, 1672×941, 1,687,415 bytes, SHA-256 `1AF06BE5A14B41E8EB1CAAAAF82DC9E029F4DD54E82275D47346A1E3DDBD5C81`. Это не production asset и не artistic approval.
