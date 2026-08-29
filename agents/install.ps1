<#
.SYNOPSIS
    Install universal AI agent skills and global rules from this repo.

.DESCRIPTION
    Provisions universal skills to ~/.agents/skills (consumed by Antigravity, Codex,
    OpenCode, Devin, Gemini CLI, Claude Code, and agent standard tools) and global
    agent rules into ~/.agents/AGENTS.md, ~/.cursorrules, ~/.windsurfrules, and ~/.clinerules.

    Usage:
        powershell -ExecutionPolicy Bypass -File agents/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$agentsDir = Join-Path $env:USERPROFILE '.agents'
$dstSkills = Join-Path $agentsDir 'skills'
$srcSkills = Join-Path $RepoRoot 'claude\skills'
$srcAgents = Join-Path $RepoRoot 'agents'

New-Item -ItemType Directory -Path $dstSkills -Force | Out-Null

# --- 1. Universal Skills (~/.agents/skills) ---
$selectionFile = Join-Path $RepoRoot 'claude\skills-selection.txt'
$selected = @()
if (Test-Path -LiteralPath $selectionFile) {
    $selected = @(Get-Content -LiteralPath $selectionFile |
        Where-Object { $_.Trim() -and -not $_.Trim().StartsWith('#') } |
        ForEach-Object { $_.Trim() })
}

if ($selected.Count -gt 0) {
    $sharedSrc = Join-Path $srcSkills 'shared'
    if (Test-Path -LiteralPath $sharedSrc) {
        robocopy $sharedSrc (Join-Path $dstSkills 'shared') /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
        if ($LASTEXITCODE -gt 7) { throw "robocopy shared failed (exit $LASTEXITCODE)" }
    }
    foreach ($s in $selected) {
        $src = Join-Path $srcSkills $s
        if (Test-Path -LiteralPath $src) {
            robocopy $src (Join-Path $dstSkills $s) /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
            if ($LASTEXITCODE -gt 7) { throw "robocopy skill '$s' failed (exit $LASTEXITCODE)" }
        } else {
            Write-Host "[warn] skill '$s' not found in repo, skipped"
        }
    }
    Write-Host "[ok] universal skills restored -> $dstSkills ($($selected.Count) selecionadas; $((Get-ChildItem -LiteralPath $dstSkills -Directory).Count) no total)"
} else {
    robocopy $srcSkills $dstSkills /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    if ($LASTEXITCODE -gt 7) { throw "robocopy skills failed (exit $LASTEXITCODE)" }
    Write-Host "[ok] universal skills restored -> $dstSkills ($((Get-ChildItem -LiteralPath $dstSkills -Directory).Count) skills)"
}

# --- 2. Global Universal AGENTS.md (~/.agents/AGENTS.md) ---
$srcGlobalAgents = Join-Path $srcAgents 'AGENTS.md'
if (Test-Path -LiteralPath $srcGlobalAgents) {
    $dstAgentsMd = Join-Path $agentsDir 'AGENTS.md'
    if (Test-Path -LiteralPath $dstAgentsMd) {
        Copy-Item $dstAgentsMd "$dstAgentsMd.pre-install.bak" -Force
    }
    Copy-Item $srcGlobalAgents $dstAgentsMd -Force
    Write-Host '[ok] global ~/.agents/AGENTS.md written'
}

# --- 3. IDE Global Rules (~/.cursorrules, ~/.windsurfrules, ~/.clinerules) ---
$rulesMap = @{
    '.cursorrules'   = Join-Path $env:USERPROFILE '.cursorrules'
    '.windsurfrules' = Join-Path $env:USERPROFILE '.windsurfrules'
    '.clinerules'    = Join-Path $env:USERPROFILE '.clinerules'
}

foreach ($entry in $rulesMap.GetEnumerator()) {
    $srcRule = Join-Path $RepoRoot $entry.Key
    $dstRule = $entry.Value
    if (Test-Path -LiteralPath $srcRule) {
        if (Test-Path -LiteralPath $dstRule) {
            Copy-Item $dstRule "$dstRule.pre-install.bak" -Force
        }
        Copy-Item $srcRule $dstRule -Force
        Write-Host "[ok] $($entry.Key) -> $dstRule"
    }
}

Write-Host ''
Write-Host 'Universal agent environment installed successfully.'
