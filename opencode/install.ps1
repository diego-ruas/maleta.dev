<#
.SYNOPSIS
    Install opencode config + plugins from this repo.

.DESCRIPTION
    Copies opencode.jsonc, AGENTS.md and package.json into ~/.config/opencode, then runs
    `npm install` so the @opencode-ai/plugin dependency is available.

    Usage:
        powershell -ExecutionPolicy Bypass -File opencode/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$opencodeDir = Join-Path $env:USERPROFILE '.config\opencode'
$srcOpencode = Join-Path $RepoRoot 'opencode'
New-Item -ItemType Directory -Path $opencodeDir -Force | Out-Null

foreach ($f in @('opencode.jsonc', 'AGENTS.md', 'package.json')) {
    $src = Join-Path $srcOpencode $f
    if (Test-Path -LiteralPath $src) {
        Copy-Item $src (Join-Path $opencodeDir $f) -Force
        Write-Host "[ok] written opencode/$f"
    }
}

$srcPlugins = Join-Path $srcOpencode 'plugins'
if (Test-Path -LiteralPath $srcPlugins) {
    $dstPlugins = Join-Path $opencodeDir 'plugins'
    New-Item -ItemType Directory -Path $dstPlugins -Force | Out-Null
    robocopy $srcPlugins $dstPlugins /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    if ($LASTEXITCODE -gt 7) { throw "robocopy plugins failed (exit $LASTEXITCODE)" }
    Write-Host '[ok] plugins restored'
}

# --- Restore node_modules (dep: @opencode-ai/plugin) ---
if (Test-Path -LiteralPath (Join-Path $opencodeDir 'package.json')) {
    Push-Location $opencodeDir
    try {
        if (Test-Path -LiteralPath (Join-Path $opencodeDir 'node_modules')) {
            Write-Host '[skip] node_modules already present'
        } else {
            npm install --no-audit --no-fund 2>&1 | Out-Host
        }
    } finally {
        Pop-Location
    }
}

Write-Host ''
Write-Host 'opencode install complete.'