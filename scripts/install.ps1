<#
.SYNOPSIS
    One-shot installer: restore Claude Code and opencode configs from this repo.

.DESCRIPTION
    Runs claude/install.ps1 and opencode/install.ps1.
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
Write-Host 'All installers finished. Restart the tools to pick up changes.'