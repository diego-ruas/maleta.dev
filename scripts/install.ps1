<#
.SYNOPSIS
    One-shot installer: restore Claude, opencode and Antigravity configs from this repo.

.DESCRIPTION
    Runs claude/install.ps1, opencode/install.ps1 and antigravity/install.ps1.
    Use this after cloning the repo to reproduce the full AI toolchain.

    Usage:
        powershell -ExecutionPolicy Bypass -File scripts/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Continue'

Write-Host '===== Claude Code ====='
& (Join-Path $RepoRoot 'claude\install.ps1') -RepoRoot $RepoRoot
Write-Host ''
Write-Host '===== opencode ====='
& (Join-Path $RepoRoot 'opencode\install.ps1') -RepoRoot $RepoRoot
Write-Host ''
Write-Host '===== Antigravity ====='
& (Join-Path $RepoRoot 'antigravity\install.ps1') -RepoRoot $RepoRoot

Write-Host ''
Write-Host 'All installers finished. Restart the tools to pick up changes.'