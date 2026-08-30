<#
.SYNOPSIS
    Install universal AI agent skills from this repo.

.DESCRIPTION
    Provisions universal skills to ~/.agents/skills (consumed by Antigravity, Codex,
    Devin, Gemini CLI, Claude Code, and agent standard tools).

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

Write-Host ''
Write-Host 'Universal agent environment installed successfully.'
