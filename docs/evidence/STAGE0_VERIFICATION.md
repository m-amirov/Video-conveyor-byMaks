# Stage 0 verification record

Date: 2026-11-24 (Europe/Moscow). This file separates executed checks from remaining gates.

## Executed PASS

- Git repository/root/remote/branch/worktree inspection before edits.
- `git ls-remote origin refs/heads/main` for project (no remote main) and WFA.
- WFA clean fast-forward to `ebfd0880cedb0f1ebd68ab9821d19fbc64f681fb`.
- OS/CPU/RAM/GPU/disk diagnostics via CIM, `Get-Volume`, `nvidia-smi`.
- Node/npm/Python/Git/Codex/FFmpeg/FFprobe version probes.
- FFmpeg encoder inventory and real H.264 NVENC encode/FFprobe smoke.
- WFA project install DryRun for four Skills: no filesystem changes, no conflicts.
- WFA project install and manifest creation; source/file SHA-256 recorded.
- Fresh Codex positive activation: observable read-only command opened `.agents/skills/character-design/SKILL.md` and returned the correct heading.
- Fresh Codex positive activation: observable read-only command opened `.agents/skills/character-consistency-qa/SKILL.md` and returned the correct heading.
- Fresh Codex negative activation: a README typo task returned `DO_NOT_ACTIVATE` without opening either character Skill.
- Built-in ImageGen real generation and workspace copy: 1672×941 PNG, SHA-256 `1AF06BE5A14B41E8EB1CAAAAF82DC9E029F4DD54E82275D47346A1E3DDBD5C81`.
- External Skill sources fetched/read at pinned SHAs; no third-party scripts executed.
- Independent Codex review completed; reported P1/P2 contract/verifier findings were repaired and rechecked with focused positive/negative cases.

## BLOCKED

- Codex runtime emitted a system-Skills refresh `Access denied` error in one concurrent positive run plus duplicate hook representation/timeout warnings; project Skill reads still completed through HTTP fallback. Global/system repair is outside project scope.
- WFA package self-containment: eight relative links inside installed managed Skills point outside the flat project install (`playbooks`, `evals`, WFA project data or category-relative `visual-qa`). Manifest hashes and actual `SKILL.md` reads PASS, but those optional cross-references are unresolved. Fix belongs in workflow-for-agents and is outside this task.
- ElevenLabs API/TTS: SDK/CLI/key and paid-call approval absent.
- Remotion render: project/dependency absent and license eligibility not yet recorded.
- Browser QA/Playwright MCP: no product UI/runtime exists; local Playwright package absent.

## NOT RUN

- Fresh-session activation for `task-planning` and `production-art`; only the two new character Skills received bounded positive cases.
- Blender, Manim, HyperFrames, GSAP and Three.js runtime tests (not installed/not needed for Stage 0).
- Production audio/video/art acceptance, publication, upload, platform moderation and analytics.
- CI on the final project commit (checked after push if GitHub Actions exists).

## Key commands

```powershell
git status --short --branch
git ls-remote origin refs/heads/main
nvidia-smi --query-gpu=name,memory.total,driver_version,pstate --format=csv,noheader
ffmpeg -hide_banner -encoders
ffmpeg -f lavfi -i color=c=black:s=1280x720:d=1 -c:v h264_nvenc -y <temp>.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height -of json <temp>.mp4
& D:\HardWork\workflow-for-agents\scripts\install.ps1 -Scope project -ProjectPath D:\HardWork\Vido\Video-conveyor-byMaks -RepositoryRoot D:\HardWork\workflow-for-agents -Skills task-planning,production-art,character-design,character-consistency-qa -DryRun
pwsh -NoProfile -File .\scripts\verify-stage0.ps1
```
