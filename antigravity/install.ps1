<#
.SYNOPSIS
    Install Antigravity assets from this repo (placeholder).

.DESCRIPTION
    Antigravity currently has no skills/plugins staged in the repo or locally
    (its local dir contains only an empty 'staging' folder). This script is a
    forward-compatible placeholder: if the repo's antigravity/ folder ever
    gains content, it copies it into %LOCALAPPDATA%\antigravity.

    Usage:
        powershell -ExecutionPolicy Bypass -File antigravity/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$srcAntigravity = Join-Path $RepoRoot 'antigravity'
$dstAntigravity = Join-Path $env:LOCALAPPDATA 'antigravity'

$content = Get-ChildItem -LiteralPath $srcAntigravity -Force | Where-Object { $_.Name -notin @('README.md', 'install.ps1') }
if (-not $content) {
    Write-Host '[skip] antigravity/ has no content yet - nothing to install.'
    Write-Host '       When Antigravity exposes skills/plugins, add them under antigravity/'
    Write-Host '       and extend this script to copy them to:' $dstAntigravity
    return
}

New-Item -ItemType Directory -Path $dstAntigravity -Force | Out-Null
robocopy $srcAntigravity $dstAntigravity /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
if ($LASTEXITCODE -gt 7) { throw "robocopy failed (exit $LASTEXITCODE)" }
Write-Host '[ok] antigravity assets restored'