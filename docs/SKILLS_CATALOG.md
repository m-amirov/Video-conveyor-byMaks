# Skills catalog

## Project-installed and structurally verified

Source: workflow-for-agents `ebfd0880cedb0f1ebd68ab9821d19fbc64f681fb`. Official project-scope installer was run after successful DryRun. Manifest: `.agents/skills/.workflow-for-agents.manifest.json`.

| Skill | Purpose | State |
|---|---|---|
| `task-planning` | risk/scope/gates and current WFA routing | INSTALLED; structural PASS |
| `production-art` | source-bound images, manifests, provenance | INSTALLED; structural PASS |
| `character-design` | canonical character reference packs | INSTALLED; structural PASS |
| `character-consistency-qa` | independent identity-drift review | INSTALLED; structural PASS |

Structural PASS is not runtime activation proof.

## Globally available and not duplicated

Current hashes matched WFA for: `git-workflow`, `codebase-exploration`, `root-cause-debugging`, `minimal-change`, `regression-testing`, `code-review`, `verification`, `audit-repair-loop`, `browser-automation`, `browser-qa`, `visual-qa`, `video-production`, `logging-standard`. Project installation was skipped to avoid unnecessary duplicates.

The global `video-production` Skill is limited to gameplay evidence/promo trailers and cannot be presented as a complete faceless production pipeline.

## External candidates

At Stage 1, the 13 official Remotion Agent Skills `4.0.546` were installed project-scope by `npx remotion skills add` after a pinned-source audit. Their source and hashes are recorded in `skills-lock.json`; they do not replace or mutate WFA-managed Skills. Structural installation is not new-session activation proof. Other external candidates remain deferred/rejected as recorded in [External Skills Audit](research/EXTERNAL_SKILLS_AUDIT.md).

## Planned project-native Skills

These are gaps, not implemented capabilities:

- `youtube-research-evidence` — dated niche/competitor/viral research with source receipts;
- `faceless-scriptwriting` — claims, retention, narration and citation contract;
- `storyboard-contract` — script-to-shot JSON with continuity and asset requirements;
- `elevenlabs-voiceover-safe` — cost/secret/voice/timestamp gates around the official SDK;
- `video-master-qa` — FFprobe/decode/playback/caption/audio evidence orchestration;
- `youtube-metadata-readiness` — SEO/thumbnail/rights package without publishing.

Own Skills should be created only after Stage 1/2 proves that no audited upstream package covers the exact contract.
