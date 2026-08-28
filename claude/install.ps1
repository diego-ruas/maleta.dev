<#
.SYNOPSIS
    Install Claude Code skills, settings, marketplaces and plugins from this repo.

.DESCRIPTION
    Copies claude/skills/* -> ~/.claude/skills, deep-merges claude/settings.json into
    ~/.claude/settings.json (local-only keys preserved), registers the marketplaces and
    installs the plugins listed in claude/plugins/plugins.json.

    Usage:
        powershell -ExecutionPolicy Bypass -File claude/install.ps1
#>
[CmdletBinding()]
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'

$claudeDir = Join-Path $env:USERPROFILE '.claude'
$srcClaude = Join-Path $RepoRoot 'claude'

# --- 1. Skills ---
$srcSkills = Join-Path $srcClaude 'skills'
$dstSkills = Join-Path $claudeDir 'skills'
New-Item -ItemType Directory -Path $dstSkills -Force | Out-Null

# Selecao opcional: se claude/skills-selection.txt existir, instala so essas.
$selectionFile = Join-Path $srcClaude 'skills-selection.txt'
$selected = @()
if (Test-Path -LiteralPath $selectionFile) {
    $selected = @(Get-Content -LiteralPath $selectionFile |
        Where-Object { $_.Trim() -and -not $_.Trim().StartsWith('#') } |
        ForEach-Object { $_.Trim() })
}
if ($selected.Count -gt 0) {
    # shared/ nao e skill (sem SKILL.md) mas e referencia interna de outras
    # skills (../shared/methodology.md) — copia sempre, fora da selecao.
    $sharedSrc = Join-Path $srcSkills 'shared'
    if (Test-Path -LiteralPath $sharedSrc) {
        robocopy $sharedSrc (Join-Path $dstSkills 'shared') /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
        if ($LASTEXITCODE -gt 7) { throw "robocopy shared failed (exit $LASTEXITCODE)" }
    }
    foreach ($s in $selected) {
        $src = Join-Path $srcSkills $s
        if (Test-Path -LiteralPath $src) {
            # robocopy, nao Copy-Item: com a pasta de destino ja existente o Copy-Item
            # aninha (~/.claude/skills/<nome>/<nome>) na segunda execucao.
            robocopy $src (Join-Path $dstSkills $s) /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
            if ($LASTEXITCODE -gt 7) { throw "robocopy skill '$s' failed (exit $LASTEXITCODE)" }
        } else {
            Write-Host "[warn] skill '$s' not found in repo, skipped"
        }
    }
    Write-Host "[ok] skills restored -> $dstSkills ($($selected.Count) selecionadas; $((Get-ChildItem -LiteralPath $dstSkills -Directory).Count) no total)"
} else {
    robocopy $srcSkills $dstSkills /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    if ($LASTEXITCODE -gt 7) { throw "robocopy skills failed (exit $LASTEXITCODE)" }
    Write-Host "[ok] skills restored -> $dstSkills ($((Get-ChildItem -LiteralPath $dstSkills -Directory).Count) skills)"
}

# --- 2. settings.json (deep merge; local-only keys are preserved) ---
function ConvertTo-Hashtable([object]$Value) {
    if ($Value -is [System.Collections.IDictionary]) { return $Value }
    if ($Value -isnot [PSCustomObject]) { return $Value }
    $h = @{}
    foreach ($p in $Value.PSObject.Properties) {
        $h[$p.Name] = ConvertTo-Hashtable $p.Value
    }
    return $h
}

# ponytail: repo wins on scalar/array conflicts; nested objects merge. Arrays are never item-merged.
function Merge-Hashtables([hashtable]$Base, [hashtable]$Repo) {
    foreach ($k in $Repo.Keys) {
        if ($Base.ContainsKey($k) -and $Base[$k] -is [hashtable] -and $Repo[$k] -is [hashtable]) {
            Merge-Hashtables $Base[$k] $Repo[$k]
        } else {
            $Base[$k] = $Repo[$k]
        }
    }
    return $Base
}

$srcSettings = Join-Path $srcClaude 'settings.json'
$dstSettings = Join-Path $claudeDir 'settings.json'
if (Test-Path -LiteralPath $srcSettings) {
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
    if (Test-Path -LiteralPath $dstSettings) {
        Copy-Item $dstSettings "$dstSettings.pre-install.bak" -Force
        $local = ConvertTo-Hashtable (Get-Content -LiteralPath $dstSettings -Raw | ConvertFrom-Json)
        $repo  = ConvertTo-Hashtable (Get-Content -LiteralPath $srcSettings -Raw | ConvertFrom-Json)
        Merge-Hashtables $local $repo | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $dstSettings -Encoding UTF8
        Write-Host '[ok] settings.json merged (previous saved as settings.json.pre-install.bak)'
    } else {
        Copy-Item $srcSettings $dstSettings -Force
        Write-Host '[ok] settings.json written'
    }
}

# --- 2b. Global rules (CLAUDE.md) ---
$srcRules = Join-Path $srcClaude 'CLAUDE.md'
if (Test-Path -LiteralPath $srcRules) {
    Copy-Item $srcRules (Join-Path $claudeDir 'CLAUDE.md') -Force
    Write-Host '[ok] CLAUDE.md written'
}

# --- 3. Marketplaces ---
$marketplaces = Get-Content -LiteralPath (Join-Path $srcClaude 'plugins\marketplaces.json') -Raw | ConvertFrom-Json
foreach ($mp in $marketplaces.marketplaces) {
    if ($mp.source -eq 'builtin') { continue }
    $repo = $mp.source.repo
    Write-Host "[..] adding marketplace '$($mp.id)' from $repo"
    claude plugin marketplace add $repo 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "claude plugin marketplace add '$($mp.id)' failed (exit $LASTEXITCODE)" }
}

# --- 4. Plugins ---
$plugins = Get-Content -LiteralPath (Join-Path $srcClaude 'plugins\plugins.json') -Raw | ConvertFrom-Json
foreach ($p in $plugins.plugins) {
    Write-Host "[..] installing plugin '$($p.id)'"
    claude plugin install $p.id 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "claude plugin install '$($p.id)' failed (exit $LASTEXITCODE)" }
}

# --- 5. MCP servers (user scope; deep-merged into ~/.claude.json, repo wins per server) ---
$mcpSrc = Join-Path $srcClaude 'mcp.json'
if (Test-Path -LiteralPath $mcpSrc) {
    $claudeJson = Join-Path $env:USERPROFILE '.claude.json'
    if (Test-Path -LiteralPath $claudeJson) {
        Copy-Item $claudeJson "$claudeJson.pre-install.bak" -Force
        $localCj = ConvertTo-Hashtable (Get-Content -LiteralPath $claudeJson -Raw | ConvertFrom-Json)
        $repoMcp = ConvertTo-Hashtable (Get-Content -LiteralPath $mcpSrc -Raw | ConvertFrom-Json)
        Merge-Hashtables $localCj $repoMcp | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $claudeJson -Encoding UTF8
        Write-Host '[ok] mcpServers merged into ~/.claude.json (previous saved as .claude.json.pre-install.bak)'
    } else {
        Copy-Item $mcpSrc $claudeJson -Force
        Write-Host '[ok] ~/.claude.json created from repo mcp.json'
    }
}

Write-Host ''
Write-Host 'Claude install complete. Restart Claude Code to load plugins.'