# Stage 1 Verification — 2026-11-24

## Verdict

- Engineering acceptance: **PASS locally** for the deterministic synthetic vertical slice.
- Visual frame/contact-sheet review: **PASS locally**, no critical clipping, overlap, missing visual or unintended empty scene observed in sampled real frames.
- Full owner playback and listening: **BLOCKED** pending owner review of the final MP4. Contact sheets and decode checks do not substitute for this gate.
- Artistic/product acceptance: **BLOCKED** pending owner decision.
- Publication readiness G6/G7: **NOT RUN**; no publication was requested or performed.
- CI: **NOT RUN** until the workflow completes on the exact pushed commit.

## License gate

Checked 2026-11-24 against the official [License FAQ](https://www.remotion.dev/docs/license/faq), [Remotion 4.0 Terms](https://www.remotion.dev/docs/terms-4-0), [upcoming 5.0 Terms](https://www.remotion.dev/docs/terms) and [license key option](https://www.remotion.dev/docs/options/license-key).

The installed stable release is Remotion `4.0.546`; the 4.0 Terms explicitly remain current until Remotion 5.0 launches. The owner stated this is an individual personal studio for own commercial and non-commercial content. The FAQ permits individuals and teams up to three people to use the Free License, including automation, without contacting Remotion or buying a license. This result depends on the accuracy and continued applicability of that owner-declared scenario; changed ownership/team/use requires a new license review.

## Implemented

- pinned Node/TypeScript/Remotion workspace and `package-lock.json`;
- official Remotion Agent Skills `4.0.546` installed project-scope from `remotion-dev/skills` and recorded in `skills-lock.json`;
- composition JSON Schema and fail-closed semantic/path/asset validation;
- local `create-production`, `validate`, `render`, `inspect` and `smoke` operations;
- frame-driven title, reveal, image motion, parallax, infographic, captions, transitions, background effects and end card;
- repository-authored deterministic 48 kHz PCM synthetic audio fixture with fades and visual accent timing;
- Remotion render followed by explicit FFmpeg limited-range `yuv420p` normalization;
- FFprobe, SHA-256, full decode, black detection, audio statistics and contact-sheet evidence.

## Exact local artifact

- Video: `D:\HardWork\Vido\Video-conveyor-byMaks\workspace\productions\ai-video-studio-demo\renders\ai-video-studio.mp4`
- Bytes: `8,820,847`
- SHA-256: `b010906b20a9c5aad6ba681d63f8f4f444c95b8ead324ca302917977612b2f4d`
- Repeat render: same bytes and SHA-256 on this machine (cross-machine bit identity is not required).
- Render time: initial Remotion pass `99,793 ms`; repeat `88,472 ms`; final normalization was separately performed after detecting the full-range pixel-format defect.
- FFprobe: `workspace/productions/ai-video-studio-demo/qa/ffprobe.json`
- Contact sheet: `workspace/productions/ai-video-studio-demo/qa/contact-sheet.png`
- Logs: `workspace/productions/ai-video-studio-demo/qa/*.log`

FFprobe result: MP4 (`mov,mp4,m4a,3gp,3g2,mj2`), duration `30.016 s`; H.264 `1080x1920`, `30/1 FPS`, limited-range `yuv420p`; AAC stereo, `48,000 Hz`. Full decode emitted no error. Blackdetect found no interval meeting `d=0.35:pix_th=0.05`. Audio peak was `-19.272 dB`, RMS `-33.686 dB`, with zero NaN/Inf samples; this is a synthetic test bed, not narration.

## Checks executed

- `npm run typecheck` — PASS.
- `npm test` — PASS, 7/7 including positive fixture, scene gap/end, missing asset, unsafe path, bad caption timing and caption safe zone.
- `npm run smoke` — PASS using bundled Chromium and CPU render.
- `npm run render` — PASS twice from fixed inputs.
- `npm run inspect` — PASS after regression fix for FFmpeg 9 removal of `-vsync`.
- `npm audit` — PASS, 0 vulnerabilities after updating direct `ajv` to `8.20.0`.
- Remotion Studio server — PASS build at `http://localhost:3100`; interactive browser attachment **BLOCKED** by desktop network policy.
- `scripts/verify-stage0.ps1` — pending final run after this report.

## Performance and hardware

Conservative concurrency `2` completed without Chromium OOM. GTX 1660 SUPER and `h264_nvenc` are available, but Remotion frame generation remains Chromium/CPU work; an extra NVENC transcode cannot accelerate React frame rendering and was not used for the accepted master. Final normalization uses local `libx264` settings. GPU snapshot after rendering showed 1,850 MiB used and 8% utilization; it is a point-in-time observation, not a render-wide telemetry trace. CPU/RAM time-series telemetry was **NOT RUN**.

## Skill and review boundaries

The official Skills were structurally installed and used in this session. A new-session observable activation test is **BLOCKED** because no separate Codex task/session was created and browser attachment was unavailable; presence of files is not activation proof. The known eight unsupported cross-repository WFA references were not edited; they remain a central WFA defect and did not block this slice.

Independent implementation review and exact final SHA/CI state are recorded at finalization. No paid API, ElevenLabs, upload, deployment, publication, push or merge occurred during render production.

## Stage 2

Add owner-approved real narration through a cost/secret/timestamp gate, introduce voice/caption synchronization evidence and loudness/ducking tests, then perform full owner playback/listening before any G6/G7 claim.
