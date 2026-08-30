<#
.SYNOPSIS
    Install Codex CLI config from this repo.

.DESCRIPTION
    Provisions skills to ~/.agents/skills (delegated to agents/install.ps1 - the
    Codex CLI discovers skills there) and appends the curated MCP servers to
    ~/.codex/config.toml without overwriting user settings.

    Usage:
        powershell -ExecutionPolicy Bypass -File codex/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$beginMarker = '# >>> maleta.dev mcp servers'
$endMarker = '# <<< maleta.dev mcp servers'

& (Join-Path $RepoRoot 'agents\install.ps1') -RepoRoot $RepoRoot

$codexDir = Join-Path $env:USERPROFILE '.codex'
New-Item -ItemType Directory -Path $codexDir -Force | Out-Null

$srcConfig = Join-Path $RepoRoot 'codex\config.toml'
$dstConfig = Join-Path $codexDir 'config.toml'
$block = $beginMarker + "`n" + (Get-Content -LiteralPath $srcConfig -Raw).TrimEnd() + "`n" + $endMarker

if (Test-Path -LiteralPath $dstConfig) {
    Copy-Item $dstConfig "$dstConfig.pre-install.bak" -Force
    Write-Host '[ok] backup config.toml -> config.toml.pre-install.bak'
    $existing = Get-Content -LiteralPath $dstConfig -Raw
    $pattern = [regex]::Escape($beginMarker) + '[\s\S]*?' + [regex]::Escape($endMarker)
    if ($existing -match $pattern) {
        $updated = [regex]::Replace($existing, $pattern, $block.Replace('$', '$$'))
        Set-Content -LiteralPath $dstConfig -Value $updated -Encoding UTF8
        Write-Host '[ok] bloco MCP do maleta.dev atualizado em config.toml'
    } else {
        Add-Content -LiteralPath $dstConfig -Value ("`n" + $block) -Encoding UTF8
        Write-Host '[ok] bloco MCP do maleta.dev adicionado ao config.toml existente'
    }
} else {
    Set-Content -LiteralPath $dstConfig -Value $block -Encoding UTF8
    Write-Host '[ok] written codex/config.toml'
}

Write-Host ''
Write-Host 'Codex install complete. Skills em ~/.agents/skills, MCP em ~/.codex/config.toml.'
