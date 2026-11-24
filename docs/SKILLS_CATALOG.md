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

Update: `task-planning` synchronized from WFA commit `4e93dfe0e5ddeba6bf9572c4336ed4415583d882`
(two changed files and recalculated manifest for the existing Windows CRLF
checkout convention); the other three Skills have matching Git blobs at that
source. This update uses a Git-level sync, not a new installer execution.
Project-local verification of this update is NOT RUN.
Native Codex profiles are separate from Skills: [routing](CODEX_ROUTING.md).

## Globally available and not duplicated

Current hashes matched WFA for: `git-workflow`, `codebase-exploration`, `root-cause-debugging`, `minimal-change`, `regression-testing`, `code-review`, `verification`, `audit-repair-loop`, `browser-automation`, `browser-qa`, `visual-qa`, `video-production`, `logging-standard`. Project installation was skipped to avoid unnecessary duplicates.

The global `video-production` Skill is limited to gameplay evidence/promo trailers and cannot be presented as a complete faceless production pipeline.

## External candidates

No external Skill was installed at Stage 0. Reasons include absent engine/project context, dependency-install commands, paid API side effects, missing/unclear redistribution license, trigger overlap and need for project-specific safety adaptation. Full evidence and decisions: [External Skills Audit](research/EXTERNAL_SKILLS_AUDIT.md).

## Planned project-native Skills

These are gaps, not implemented capabilities:

- `youtube-research-evidence` — dated niche/competitor/viral research with source receipts;
- `faceless-scriptwriting` — claims, retention, narration and citation contract;
- `storyboard-contract` — script-to-shot JSON with continuity and asset requirements;
- `elevenlabs-voiceover-safe` — cost/secret/voice/timestamp gates around the official SDK;
- `video-master-qa` — FFprobe/decode/playback/caption/audio evidence orchestration;
- `youtube-metadata-readiness` — SEO/thumbnail/rights package without publishing.

Own Skills should be created only after Stage 1/2 proves that no audited upstream package covers the exact contract.
