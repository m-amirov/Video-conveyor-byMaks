[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$failures = [System.Collections.Generic.List[string]]::new()

function Add-Failure([string]$Message) {
    $failures.Add($Message)
    Write-Host "FAIL  $Message" -ForegroundColor Red
}

function Add-Pass([string]$Message) {
    Write-Host "PASS  $Message" -ForegroundColor Green
}

$required = @(
    'README.md', 'AGENTS.md', '.gitignore', '.env.example',
    'docs/PROJECT_VISION.md', 'docs/ARCHITECTURE.md', 'docs/ROADMAP.md',
    'docs/ENVIRONMENT.md', 'docs/SKILLS_CATALOG.md', 'docs/TOOLCHAIN.md',
    'docs/PRODUCTION_PIPELINE.md', 'docs/QUALITY_GATES.md', 'docs/CODEX_ROUTING.md',
    '.codex/agents/wfa_explorer.toml', '.codex/agents/wfa_worker.toml', '.codex/agents/wfa_reviewer.toml',
    'docs/decisions/0001-foundation.md',
    'docs/research/EXTERNAL_SKILLS_AUDIT.md',
    'schemas/channel-config.schema.json', 'schemas/stage-record.schema.json'
)

foreach ($relative in $required) {
    $path = Join-Path $repoRoot $relative
    if (Test-Path -LiteralPath $path -PathType Leaf) { Add-Pass "exists: $relative" }
    else { Add-Failure "missing: $relative" }
}

foreach ($relative in 'schemas/channel-config.schema.json', 'schemas/stage-record.schema.json') {
    try {
        Get-Content -LiteralPath (Join-Path $repoRoot $relative) -Raw -Encoding UTF8 | ConvertFrom-Json | Out-Null
        Add-Pass "valid JSON: $relative"
    } catch {
        Add-Failure "invalid JSON: $relative ($($_.Exception.Message))"
    }
}

$schemaValidation = @'
import json
import pathlib
import sys

try:
    import jsonschema
except ImportError:
    print("jsonschema module is unavailable", file=sys.stderr)
    raise SystemExit(2)

failed = False
loaded = {}
root = pathlib.Path(sys.argv[1])
for relative in ("schemas/channel-config.schema.json", "schemas/stage-record.schema.json"):
    schema = json.loads((root / relative).read_text(encoding="utf-8"))
    loaded[relative] = schema
    try:
        jsonschema.Draft202012Validator.check_schema(schema)
    except jsonschema.SchemaError as exc:
        print(f"{relative}: {exc.message}", file=sys.stderr)
        failed = True

stage_validator = jsonschema.Draft202012Validator(
    loaded["schemas/stage-record.schema.json"],
    format_checker=jsonschema.FormatChecker(),
)
channel_validator = jsonschema.Draft202012Validator(loaded["schemas/channel-config.schema.json"])
valid_channel = {
    "schemaVersion": 1,
    "channelId": "stage0-channel",
    "title": "Stage 0",
    "platforms": ["youtube"],
    "language": "ru-RU",
    "contentPolicy": {"faceless": True, "originalOnly": True, "paidApiApprovalRequired": True},
}
valid_pass = {
    "schemaVersion": 1,
    "productionId": "stage0-contract",
    "stage": "G0",
    "status": "PASS",
    "recordedAt": "2026-11-24T00:00:00Z",
    "sourceCommit": "a" * 40,
    "inputs": [{
        "artifactId": "channel-brief",
        "path": "channels/stage0.json",
        "mediaType": "application/json",
        "sha256": "c" * 64,
        "bytes": 64,
        "provenance": "owner-authored-input",
    }],
    "outputs": [{
        "artifactId": "research-record",
        "path": "research/result.json",
        "mediaType": "application/json",
        "sha256": "b" * 64,
        "bytes": 128,
        "provenance": "local-stage-output",
    }],
    "checks": [{"name": "contract", "status": "PASS", "evidence": {
        "path": "qa/receipt.json",
        "mediaType": "application/json",
        "sha256": "d" * 64,
        "bytes": 96,
        "provenance": "local-validator-output",
    }}],
    "blockers": [],
    "toolVersions": {"validator": "jsonschema-4"},
}
negative_cases = {
    "PASS with a failed check": {**valid_pass, "checks": [{**valid_pass["checks"][0], "status": "FAIL"}]},
    "PASS without source commit": {**valid_pass, "sourceCommit": None},
    "PASS without inputs": {**valid_pass, "inputs": []},
    "PASS without immutable output evidence": {**valid_pass, "outputs": [{"artifactId": "research-record", "path": "research/result.json", "mediaType": "application/json", "sha256": None}]},
    "PASS without tool versions": {key: value for key, value in valid_pass.items() if key != "toolVersions"},
    "PASS with unbound input": {**valid_pass, "inputs": [{"artifactId": "prior", "path": "research/prior.json", "mediaType": "application/json", "sha256": None}]},
    "PASS with unbound check evidence": {**valid_pass, "checks": [{"name": "contract", "status": "PASS", "evidence": {"path": "qa/receipt.json"}}]},
    "path traversal": {**valid_pass, "outputs": [{**valid_pass["outputs"][0], "path": "../../outside.json"}]},
    "Windows device path": {**valid_pass, "outputs": [{**valid_pass["outputs"][0], "path": "qa/nul.txt"}]},
    "normalization-ambiguous path": {**valid_pass, "outputs": [{**valid_pass["outputs"][0], "path": "qa/foo. "}]},
    "BLOCKED without blocker": {**valid_pass, "status": "BLOCKED", "sourceCommit": None, "outputs": [], "checks": [], "blockers": []},
    "FAIL without failed check": {**valid_pass, "status": "FAIL", "sourceCommit": None, "outputs": [], "checks": []},
}
if list(channel_validator.iter_errors(valid_channel)):
    print("channel-config positive contract case was rejected", file=sys.stderr)
    failed = True
unsafe_channel = {**valid_channel, "contentPolicy": {**valid_channel["contentPolicy"], "paidApiApprovalRequired": False}}
if not list(channel_validator.iter_errors(unsafe_channel)):
    print("channel-config accepted disabled paid API approval", file=sys.stderr)
    failed = True
if list(stage_validator.iter_errors(valid_pass)):
    print("stage-record positive contract case was rejected", file=sys.stderr)
    failed = True
for name, instance in negative_cases.items():
    if not list(stage_validator.iter_errors(instance)):
        print(f"stage-record negative case was accepted: {name}", file=sys.stderr)
        failed = True

raise SystemExit(1 if failed else 0)
'@
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
$localPython313 = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python313\python.exe'
$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pythonCommand) {
    $schemaValidation | & $pythonCommand.Source - $repoRoot
    $schemaExitCode = $LASTEXITCODE
} elseif (Test-Path -LiteralPath $localPython313 -PathType Leaf) {
    $schemaValidation | & $localPython313 - $repoRoot
    $schemaExitCode = $LASTEXITCODE
} elseif ($pyLauncher) {
    $schemaValidation | & $pyLauncher.Source -3.13 - $repoRoot
    $schemaExitCode = $LASTEXITCODE
} else {
    $schemaExitCode = 127
}
if ($schemaExitCode -ne 0) { Add-Failure 'JSON Schema meta-validation failed or Python/jsonschema validator unavailable' }
else { Add-Pass 'JSON Schema meta-validation and positive/negative contract cases' }

$markdownFiles = Get-ChildItem -LiteralPath $repoRoot -Recurse -Filter '*.md' -File | Where-Object {
    $_.FullName -notmatch '[\\/](\.git|\.agents|workspace|node_modules)[\\/]'
}
foreach ($file in $markdownFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    foreach ($match in [regex]::Matches($content, '\[[^\]]+\]\(([^)]+)\)')) {
        $target = $match.Groups[1].Value
        if ($target -match '^(https?://|#|mailto:)' -or $target -match '^codex://') { continue }
        $pathPart = ($target -split '#', 2)[0]
        if ([string]::IsNullOrWhiteSpace($pathPart)) { continue }
        $decoded = [System.Uri]::UnescapeDataString($pathPart).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $resolved = [System.IO.Path]::GetFullPath((Join-Path $file.DirectoryName $decoded))
        if (-not (Test-Path -LiteralPath $resolved)) {
            Add-Failure "broken local link: $($file.FullName.Substring($repoRoot.Length + 1)) -> $target"
        }
    }
}
if (-not ($failures | Where-Object { $_ -like 'broken local link:*' })) { Add-Pass 'local Markdown links resolve' }

$skillsRoot = Join-Path $repoRoot '.agents\skills'
$manifestPath = Join-Path $skillsRoot '.workflow-for-agents.manifest.json'
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    Add-Failure 'WFA manifest missing'
} else {
    try {
        $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($manifest.schema -ne 1 -or $manifest.source -ne 'workflow-for-agents') {
            Add-Failure 'WFA manifest header is invalid'
        } else {
            Add-Pass 'WFA manifest header'
        }

        $names = @($manifest.installed | ForEach-Object { $_.name })
        $duplicates = @($names | Group-Object | Where-Object Count -gt 1)
        if ($duplicates.Count -gt 0) { Add-Failure "duplicate manifest skill names: $($duplicates.Name -join ', ')" }
        else { Add-Pass 'unique manifest skill names' }

        $expectedNames = @('task-planning', 'production-art', 'character-design', 'character-consistency-qa')
        $missingNames = @($expectedNames | Where-Object { $_ -notin $names })
        $unexpectedNames = @($names | Where-Object { $_ -notin $expectedNames })
        if ($missingNames.Count -gt 0 -or $unexpectedNames.Count -gt 0) {
            Add-Failure "WFA manifest skill set mismatch (missing: $($missingNames -join ', '); unexpected: $($unexpectedNames -join ', '))"
        } else {
            Add-Pass 'expected WFA manifest skill set'
        }

        $actualSkillDirs = @(Get-ChildItem -LiteralPath $skillsRoot -Directory | ForEach-Object { $_.Name })
        $unregisteredDirs = @($actualSkillDirs | Where-Object { $_ -notin $names })
        if ($unregisteredDirs.Count -gt 0) { Add-Failure "unregistered project Skill directories: $($unregisteredDirs -join ', ')" }
        else { Add-Pass 'no unregistered project Skill directories' }

        foreach ($entry in $manifest.installed) {
            $skillDir = Join-Path $skillsRoot $entry.name
            $skillFile = Join-Path $skillDir 'SKILL.md'
            if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
                Add-Failure "missing SKILL.md: $($entry.name)"
                continue
            }
            $frontmatter = Get-Content -LiteralPath $skillFile -TotalCount 12 -Encoding UTF8 | Out-String
            if ($frontmatter -notmatch '(?m)^name:\s*' -or $frontmatter -notmatch '(?m)^description:\s*') {
                Add-Failure "invalid frontmatter: $($entry.name)"
            } else {
                Add-Pass "SKILL.md frontmatter: $($entry.name)"
            }
            foreach ($file in $entry.files) {
                $target = Join-Path $skillDir $file.path
                if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
                    Add-Failure "manifest file missing: $($entry.name)/$($file.path)"
                    continue
                }
                $actual = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant()
                if ($actual -ne ([string]$file.sha256).ToLowerInvariant()) {
                    Add-Failure "manifest hash mismatch: $($entry.name)/$($file.path)"
                }
            }
        }
        if ($failures.Count -eq 0) { Add-Pass 'all WFA manifest file hashes' }
    } catch {
        Add-Failure "cannot validate WFA manifest: $($_.Exception.Message)"
    }
}

$profiles = @{
    wfa_explorer = @('gpt-6-luna', 'low')
    wfa_worker = @('gpt-6-luna', 'low')
    wfa_reviewer = @('gpt-6.2-sol', 'medium')
}
foreach ($name in $profiles.Keys) {
    $path = Join-Path $repoRoot ".codex/agents/$name.toml"
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { continue }
    $profile = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    $model = [regex]::Escape($profiles[$name][0])
    $effort = [regex]::Escape($profiles[$name][1])
    if ($profile -notmatch ('(?m)^name\s*=\s*"' + $name + '"\s* -LiteralPath (Join-Path $repoRoot '.gitignore') -Raw -Encoding UTF8
foreach ($pattern in '.env', 'node_modules/', 'workspace/', 'renders/', 'cookies/') {
    if ($ignore -notmatch [regex]::Escape($pattern)) { Add-Failure ".gitignore missing pattern: $pattern" }
    else { Add-Pass ".gitignore pattern: $pattern" }
}

$textExtensions = @('.md', '.json', '.ps1', '.ts', '.tsx', '.js', '.mjs', '.yaml', '.yml', '.toml', '.txt', '.example')
$secretPattern = '(?i)(sk-[A-Za-z0-9_-]{20,}|xi-[A-Za-z0-9_-]{20,}|rm_sec_[A-Za-z0-9_-]{16,}|ELEVENLABS_API_KEY\s*=\s*[^\s#]+)'
$scanFiles = Get-ChildItem -LiteralPath $repoRoot -Recurse -File | Where-Object {
    $_.FullName -notmatch '[\\/](\.git|workspace|node_modules|renders|exports)[\\/]' -and
    ($textExtensions -contains $_.Extension -or $_.Name -eq '.env.example')
}
foreach ($file in $scanFiles) {
    $matches = Select-String -LiteralPath $file.FullName -Pattern $secretPattern -AllMatches
    if ($matches) { Add-Failure "possible secret pattern: $($file.FullName.Substring($repoRoot.Length + 1))" }
}
if (-not ($failures | Where-Object { $_ -like 'possible secret pattern:*' })) { Add-Pass 'no common secret patterns in project text files' }

if ($failures.Count -gt 0) {
    Write-Host "`nStage 0 structural verification: FAIL ($($failures.Count) issue(s))" -ForegroundColor Red
    exit 1
}

Write-Host "`nStage 0 structural verification: PASS" -ForegroundColor Green
) -or
        $profile -notmatch ('(?m)^model\s*=\s*"' + $model + '"\s* -LiteralPath (Join-Path $repoRoot '.gitignore') -Raw -Encoding UTF8
foreach ($pattern in '.env', 'node_modules/', 'workspace/', 'renders/', 'cookies/') {
    if ($ignore -notmatch [regex]::Escape($pattern)) { Add-Failure ".gitignore missing pattern: $pattern" }
    else { Add-Pass ".gitignore pattern: $pattern" }
}

$textExtensions = @('.md', '.json', '.ps1', '.ts', '.tsx', '.js', '.mjs', '.yaml', '.yml', '.txt', '.example')
$secretPattern = '(?i)(sk-[A-Za-z0-9_-]{20,}|xi-[A-Za-z0-9_-]{20,}|rm_sec_[A-Za-z0-9_-]{16,}|ELEVENLABS_API_KEY\s*=\s*[^\s#]+)'
$scanFiles = Get-ChildItem -LiteralPath $repoRoot -Recurse -File | Where-Object {
    $_.FullName -notmatch '[\\/](\.git|workspace|node_modules|renders|exports)[\\/]' -and
    ($textExtensions -contains $_.Extension -or $_.Name -eq '.env.example')
}
foreach ($file in $scanFiles) {
    $matches = Select-String -LiteralPath $file.FullName -Pattern $secretPattern -AllMatches
    if ($matches) { Add-Failure "possible secret pattern: $($file.FullName.Substring($repoRoot.Length + 1))" }
}
if (-not ($failures | Where-Object { $_ -like 'possible secret pattern:*' })) { Add-Pass 'no common secret patterns in project text files' }

if ($failures.Count -gt 0) {
    Write-Host "`nStage 0 structural verification: FAIL ($($failures.Count) issue(s))" -ForegroundColor Red
    exit 1
}

Write-Host "`nStage 0 structural verification: PASS" -ForegroundColor Green
) -or
        $profile -notmatch ('(?m)^model_reasoning_effort\s*=\s*"' + $effort + '"\s* -LiteralPath (Join-Path $repoRoot '.gitignore') -Raw -Encoding UTF8
foreach ($pattern in '.env', 'node_modules/', 'workspace/', 'renders/', 'cookies/') {
    if ($ignore -notmatch [regex]::Escape($pattern)) { Add-Failure ".gitignore missing pattern: $pattern" }
    else { Add-Pass ".gitignore pattern: $pattern" }
}

$textExtensions = @('.md', '.json', '.ps1', '.ts', '.tsx', '.js', '.mjs', '.yaml', '.yml', '.txt', '.example')
$secretPattern = '(?i)(sk-[A-Za-z0-9_-]{20,}|xi-[A-Za-z0-9_-]{20,}|rm_sec_[A-Za-z0-9_-]{16,}|ELEVENLABS_API_KEY\s*=\s*[^\s#]+)'
$scanFiles = Get-ChildItem -LiteralPath $repoRoot -Recurse -File | Where-Object {
    $_.FullName -notmatch '[\\/](\.git|workspace|node_modules|renders|exports)[\\/]' -and
    ($textExtensions -contains $_.Extension -or $_.Name -eq '.env.example')
}
foreach ($file in $scanFiles) {
    $matches = Select-String -LiteralPath $file.FullName -Pattern $secretPattern -AllMatches
    if ($matches) { Add-Failure "possible secret pattern: $($file.FullName.Substring($repoRoot.Length + 1))" }
}
if (-not ($failures | Where-Object { $_ -like 'possible secret pattern:*' })) { Add-Pass 'no common secret patterns in project text files' }

if ($failures.Count -gt 0) {
    Write-Host "`nStage 0 structural verification: FAIL ($($failures.Count) issue(s))" -ForegroundColor Red
    exit 1
}

Write-Host "`nStage 0 structural verification: PASS" -ForegroundColor Green
)) {
        Add-Failure "WFA agent profile mismatch: $name"
    } else { Add-Pass "WFA agent profile fields: $name" }
}

$ignore = Get-Content -LiteralPath (Join-Path $repoRoot '.gitignore') -Raw -Encoding UTF8
foreach ($pattern in '.env', 'node_modules/', 'workspace/', 'renders/', 'cookies/') {
    if ($ignore -notmatch [regex]::Escape($pattern)) { Add-Failure ".gitignore missing pattern: $pattern" }
    else { Add-Pass ".gitignore pattern: $pattern" }
}

$textExtensions = @('.md', '.json', '.ps1', '.ts', '.tsx', '.js', '.mjs', '.yaml', '.yml', '.txt', '.example')
$secretPattern = '(?i)(sk-[A-Za-z0-9_-]{20,}|xi-[A-Za-z0-9_-]{20,}|rm_sec_[A-Za-z0-9_-]{16,}|ELEVENLABS_API_KEY\s*=\s*[^\s#]+)'
$scanFiles = Get-ChildItem -LiteralPath $repoRoot -Recurse -File | Where-Object {
    $_.FullName -notmatch '[\\/](\.git|workspace|node_modules|renders|exports)[\\/]' -and
    ($textExtensions -contains $_.Extension -or $_.Name -eq '.env.example')
}
foreach ($file in $scanFiles) {
    $matches = Select-String -LiteralPath $file.FullName -Pattern $secretPattern -AllMatches
    if ($matches) { Add-Failure "possible secret pattern: $($file.FullName.Substring($repoRoot.Length + 1))" }
}
if (-not ($failures | Where-Object { $_ -like 'possible secret pattern:*' })) { Add-Pass 'no common secret patterns in project text files' }

if ($failures.Count -gt 0) {
    Write-Host "`nStage 0 structural verification: FAIL ($($failures.Count) issue(s))" -ForegroundColor Red
    exit 1
}

Write-Host "`nStage 0 structural verification: PASS" -ForegroundColor Green
