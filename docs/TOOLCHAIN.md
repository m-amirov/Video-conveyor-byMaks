# Toolchain

## Approved direction

| Area | Primary | Secondary / fallback | Stage 0 state |
|---|---|---|---|
| Orchestration | Codex | local CLI | available |
| Images | built-in Codex ImageGen | Blender/Three.js/Manim for suitable work | ImageGen smoke PASS |
| Voice | ElevenLabs | Faster Whisper only for transcription/subtitles | integration deferred |
| Video engine | Remotion | HyperFrames; FFmpeg assembly | not installed |
| Motion | Remotion primitives | GSAP | not installed |
| 3D | Three.js | Blender | not installed |
| Technical animation | Manim | Remotion/Three.js | not installed |
| Browser research | Playwright / host browser automation | manual browser | local CLI absent |
| Inspection | FFprobe, FFmpeg | MediaInfo if later justified | available |

## Remotion license gate

Current official terms state that Remotion is source-available under a proprietary Remotion License, not OSI open source. Individuals and organizations up to three people may qualify for a free license, including automation; other organizations can require Creator/Automator licensing. Before Stage 1 dependency installation/render use, owner eligibility and the current terms must be recorded. Sources: [license FAQ](https://www.remotion.dev/docs/license/faq), [terms](https://www.remotion.dev/docs/terms), [license key option](https://www.remotion.dev/docs/options/license-key).

## ElevenLabs integration contract

- Official SDKs: Python `elevenlabs`; JavaScript/TypeScript `@elevenlabs/elevenlabs-js` (not the obsolete npm `elevenlabs` package).
- Key only via `ELEVENLABS_API_KEY` in process environment or gitignored `.env`.
- Voice IDs are listed from the actual account; never trust remembered/tutorial IDs.
- TTS generation is a paid/external side effect and requires per-run approval until an explicit budget policy exists.
- Capture request ID, model, voice ID, character count, output format, bytes/hash and cost evidence without logging the key.
- Use the official `stream/with-timestamps` or non-streaming timestamps endpoint when word/character alignment is required; do not infer exact cue timing from audio duration alone.
- Voice cloning, library voices, music, dubbing and sound-effects remain separate authorization/rights gates.

Sources: [official Skills repository](https://github.com/elevenlabs/skills), [list voices](https://elevenlabs.io/docs/api-reference/voices/search), [stream speech with timing](https://elevenlabs.io/docs/api-reference/text-to-speech/stream-with-timestamps).

## Installation policy

Stage 0 intentionally does not create package manifests or install engines before the first vertical-slice contract and Remotion license decision. Stage 1 must pin versions in lockfiles, run source-driven documentation checks and avoid global package installs.

Explicitly excluded without a separate decision: ComfyUI, Stable Diffusion, FLUX, Ollama, Piper, Wan, LTX Video and additional paid APIs.
