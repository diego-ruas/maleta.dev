<#
.SYNOPSIS
    Install Codex CLI config from this repo.

.DESCRIPTION
    Provisions skills to ~/.agents/skills (delegated to agents/install.ps1 - the
    Codex CLI discovers skills there).

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

# ponytail: limpa bloco MCP de instalacoes antigas (removido, ver AGENTS.md)
$dstConfig = Join-Path $env:USERPROFILE '.codex\config.toml'
if (Test-Path -LiteralPath $dstConfig) {
    $existing = Get-Content -LiteralPath $dstConfig -Raw
    $pattern = [regex]::Escape($beginMarker) + '[\s\S]*?' + [regex]::Escape($endMarker)
    if ($existing -match $pattern) {
        Copy-Item $dstConfig "$dstConfig.pre-install.bak" -Force
        $updated = [regex]::Replace($existing, "`n?$pattern", '')
        Set-Content -LiteralPath $dstConfig -Value $updated -Encoding UTF8
        Write-Host '[ok] bloco MCP antigo removido de config.toml (backup em config.toml.pre-install.bak)'
    }
}

Write-Host ''
Write-Host 'Codex install complete. Skills em ~/.agents/skills.'
