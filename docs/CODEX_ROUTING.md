# Codex token-saving routing

Source: [WFA 4e93dfe0e5ddeba6bf9572c4336ed4415583d882](https://github.com/m-amirov/workflow-for-agents/commit/4e93dfe0e5ddeba6bf9572c4336ed4415583d882).
The project-local definitions were originally copied from that commit.
Compatibility correction: [WFA 13b3d4efc5d4d08e8685241fedbac8feba8f19d2](https://github.com/m-amirov/workflow-for-agents/commit/13b3d4efc5d4d08e8685241fedbac8feba8f19d2)
changes the two lightweight profiles to GPT-5.6 Luna. GPT-6 Luna was
rejected in the owner's ChatGPT-authenticated Codex session on 2026-11-24.
GPT-5.6 Luna was visible in the account model picker; successful local
execution of the replacement is still to be verified. Historical evidence
reports retain the actual models used in those sessions.
Owner opt-in is recorded in [AGENTS.md](../AGENTS.md); no global HOME or global
model configuration is changed. Astra is excluded from the project routing.

| Profile | Model | Effort |
| --- | --- | --- |
| Root (user-selected) | gpt-5.6-sol | medium |
| wfa_explorer | gpt-5.6-luna | low |
| wfa_worker | gpt-5.6-luna | low |
| wfa_reviewer | gpt-5.6-sol | medium |

Direct tools: schema validation, hashing, FFprobe, known scripts.
Explorer: bounded source/file discovery, selected log evidence.
Worker: SMALL/LOW-risk local edits with known acceptance checks.
Root: complex scripts, architecture, editing pipeline, rights, permissions,
unknown/high risk, external tools and final stage decisions.
Reviewer: independent review when required, not a substitute for actual
playback, visual/audio/rights evidence or mandatory project gates.

Subagents must not invoke paid APIs, ImageGen, publish, access secrets or
perform external writes. The project rules remain authoritative; no new
permission or production readiness follows from routing.

## Native versus Web routes

The reviewer profile is synchronized with [WFA 74eb02f6e58fcd793e2353593d0569cc45a6d336](https://github.com/m-amirov/workflow-for-agents/commit/74eb02f6e58fcd793e2353593d0569cc45a6d336).
The owner's model picker on 2026-11-24 distinguishes native GPT-5.6 Sol and
GPT-5.6 Luna from entries marked "(Web)" provided by the unofficial
[Codex ChatGPT Web adapter](https://github.com/miuuyy/codex-chatgpt-web).
The root and required reviewer use native GPT-5.6 Sol, not a Web entry.
Only Instant Web entries are permitted by the owner, optionally and manually
for bounded non-sensitive standalone text work. No Web model is configured
as a project agent or automatic fallback. Mandatory engineering routes,
local writes, tests, review and release gates remain native. Do not change
adapter configuration or disclose private project context. Full Harness and
cross-backend tools require separate actual runtime verification.
Astra and non-Instant Web routes are excluded.

## Activation and verification

After a fast-forward pull, restart Codex in the trusted project with native GPT-5.6 Sol medium (no Web suffix).
Check the three custom agent names and availability of actual models.
The root model is selected by the user; no configuration silently overrides it.
If a route is unavailable, report BLOCKED and do not silently substitute.
Run `pwsh -NoProfile -File ./scripts/verify-stage0.ps1` on the existing Windows
checkout (the installed Skill manifest hashes CRLF files). Perform smoke tests:
tiny direct edit (no child), bounded read and low-risk edit (Luna), mandatory
independent review (Sol). Capture actual thread/model metadata when available.
Compare direct Sol against the delegated route using identical tasks, checks,
and root settings. Sum root and all child input/output tokens (including cached
input, without double-counting reasoning), compare correctness and retries.
Record unknown fields rather than estimating usage. No paid media calls.

Static configuration and source matching do not prove actual activation,
token savings, or Stage 0 verification. To suspend delegation, explicitly
disable the token-saving mode in the project AGENTS.md; leave definitions
and Skill manifest intact.
