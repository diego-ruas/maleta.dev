<#
.SYNOPSIS
    Install opencode config + plugins from this repo.

.DESCRIPTION
    Copies opencode.jsonc, opencode.json, AGENTS.md and the plugins/ folder into
    ~/.config/opencode. No npm install needed: claude-mem.js ships as a standalone
    bundle and the rest are npm/git plugin references resolved by opencode itself.

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

foreach ($f in @('opencode.jsonc', 'opencode.json', 'AGENTS.md')) {
    $src = Join-Path $srcOpencode $f
    if (Test-Path -LiteralPath $src) {
        $dst = Join-Path $opencodeDir $f
        if (Test-Path -LiteralPath $dst) {
            Copy-Item $dst "$dst.pre-install.bak" -Force
            Write-Host "[ok] backup opencode/$f -> $f.pre-install.bak"
        }
        Copy-Item $src $dst -Force
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

Write-Host ''
Write-Host 'opencode install complete.'