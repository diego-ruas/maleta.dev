<#
.SYNOPSIS
    Scraper/Crawler para monitorar e descobrir skills no repositorio anthropics/skills, forks e topicos do GitHub.

.DESCRIPTION
    Realiza varredura via GitHub API no repositorio oficial da Anthropic (anthropics/skills),
    seus forks com mais estrelas/atualizacoes e topicos comunitarios (claude-skills, anthropic-skills).
    Compara os resultados com as skills locais em claude/skills/ e aponta novas oportunidades de importacao.

.PARAMETER GitHubToken
    Token do GitHub (opcional, aumenta o limite de requisicoes de 60/h para 5000/h).
    Pode ser lido automaticamente de $env:GITHUB_TOKEN ou $env:GH_TOKEN.

.PARAMETER MaxForks
    Numero maximo de forks populares a serem inspecionados (padrao: 15).

.PARAMETER ExportReport
    Caminho opcional para exportar o relatorio em Markdown.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/crawl-anthropic-skills.ps1

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/crawl-anthropic-skills.ps1 -ExportReport docs/DISCOVERED_SKILLS.md
#>

[CmdletBinding()]
param(
    [string]$GitHubToken = $(if ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } elseif ($env:GH_TOKEN) { $env:GH_TOKEN } else { $null }),
    [int]$MaxForks = 15,
    [string]$ExportReport = "",
    [string]$RepoRoot = ""
)

if (-not $RepoRoot) {
    if ($PSScriptRoot) {
        $RepoRoot = Split-Path -Parent $PSScriptRoot
    } else {
        $RepoRoot = (Get-Location).Path
    }
}

$ErrorActionPreference = 'Stop'

function Get-GitHubHeaders {
    param([string]$Token)
    $headers = @{
        'User-Agent' = 'maleta-dev-skill-crawler/1.0'
        'Accept'     = 'application/vnd.github.v3+json'
    }
    if ($Token) {
        $headers['Authorization'] = "token $Token"
    }
    return $headers
}

function Invoke-GitHubApi {
    param(
        [string]$Uri,
        [hashtable]$Headers
    )
    try {
        return Invoke-RestMethod -Uri $Uri -Headers $Headers -Method Get -TimeoutSec 30
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 403) {
            Write-Warning 'Limite de requisicoes da GitHub API atingido (Rate Limit). Configure um GITHUB_TOKEN para 5000 req/h.'
        }
        else {
            Write-Verbose "Erro ao acessar $Uri : $_"
        }
        return $null
    }
}

# 1. Carregar skills locais existentes
$localSkillsDir = Join-Path $RepoRoot 'claude\skills'
$localSkills = @{}
if (Test-Path $localSkillsDir) {
    Get-ChildItem -Path $localSkillsDir -Directory | ForEach-Object {
        $localSkills[$_.Name] = $true
    }
}

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host '  MALETA.DEV - Anthropic Skills Scraper and Crawler' -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host "Skills locais monitoradas em claude/skills/: $($localSkills.Count)"
if ($GitHubToken) {
    Write-Host 'Autenticacao GitHub: [OK] Token presente' -ForegroundColor Green
} else {
    Write-Host 'Autenticacao GitHub: [AVISO] Nao autenticado (limite de 60 req/hora)' -ForegroundColor Yellow
}
Write-Host ''

$headers = Get-GitHubHeaders -Token $GitHubToken
$discoveredSkills = [System.Collections.Generic.List[PSCustomObject]]::new()

# Lista de diretorios que nunca sao skills
$ignoredDirs = @('docs', 'doc', 'tests', 'test', 'bin', 'src', 'assets', 'scripts', 'script', '.github', 'node_modules', 'dist', 'build', 'media', 'fixtures', 'examples', 'packages', 'templates', 'launchd', 'container', 'evals', 'hooks', 'extensions', 'screenshots')

function Test-IsSkillDirectory {
    param(
        [string]$RepoFullName,
        [string]$DirPath,
        [hashtable]$Headers
    )
    $checkUrl = 'https://api.github.com/repos/' + $RepoFullName + '/contents/' + $DirPath + '/SKILL.md'
    $skillMd = Invoke-GitHubApi -Uri $checkUrl -Headers $Headers
    return ($null -ne $skillMd)
}

# 2. Inspecionar repositorio oficial da Anthropic
Write-Host '[1/3] Consultando repositorio oficial (anthropics/skills)...' -ForegroundColor Magenta
$officialUrl = 'https://api.github.com/repos/anthropics/skills/contents/skills'
$officialItems = Invoke-GitHubApi -Uri $officialUrl -Headers $headers

if ($officialItems) {
    foreach ($item in $officialItems) {
        if ($item.type -eq 'dir' -and -not ($item.name.StartsWith('.'))) {
            $isLocal = $localSkills.ContainsKey($item.name)
            $discoveredSkills.Add([PSCustomObject]@{
                Name        = $item.name
                SourceRepo  = 'anthropics/skills'
                SourceType  = 'Oficial'
                HtmlUrl     = $item.html_url
                IsInstalled = $isLocal
                Description = 'Oficial Anthropic Skill'
            })
        }
    }
}

# 3. Inspecionar Forks Populares de anthropics/skills
Write-Host '[2/3] Buscando forks populares de anthropics/skills...' -ForegroundColor Magenta
$forksUrl = 'https://api.github.com/repos/anthropics/skills/forks?sort=stargazers&per_page=' + $MaxForks
$forks = Invoke-GitHubApi -Uri $forksUrl -Headers $headers

if ($forks) {
    foreach ($fork in $forks) {
        $forkFullName = $fork.full_name
        Write-Host "  -> Inspecionando fork: $forkFullName (Stars: $($fork.stargazers_count))" -ForegroundColor Gray
        
        # Prioriza subpasta /skills se existir
        $forkContentsUrl = 'https://api.github.com/repos/' + $forkFullName + '/contents/skills'
        $forkItems = Invoke-GitHubApi -Uri $forkContentsUrl -Headers $headers
        
        if ($forkItems) {
            foreach ($item in $forkItems) {
                if ($item.type -eq 'dir' -and -not ($item.name.StartsWith('.')) -and ($ignoredDirs -notcontains $item.name.ToLower())) {
                    $alreadyFound = $discoveredSkills | Where-Object { $_.Name -eq $item.name }
                    if (-not $alreadyFound) {
                        $isLocal = $localSkills.ContainsKey($item.name)
                        $discoveredSkills.Add([PSCustomObject]@{
                            Name        = $item.name
                            SourceRepo  = $forkFullName
                            SourceType  = 'Fork Comunitario'
                            HtmlUrl     = $item.html_url
                            IsInstalled = $isLocal
                            Description = "Skill em fork ($forkFullName)"
                        })
                    }
                }
            }
        }
    }
}

# 4. Inspecionar Repositorios com Topicos da Comunidade (claude-skills / anthropic-skills)
Write-Host '[3/3] Buscando repositorios comunitarios com topico claude-skills...' -ForegroundColor Magenta
$searchTopicsUrl = 'https://api.github.com/search/repositories?q=topic:claude-skills+sort:stars&per_page=10'
$topicRepos = Invoke-GitHubApi -Uri $searchTopicsUrl -Headers $headers

if ($topicRepos -and $topicRepos.items) {
    foreach ($repo in $topicRepos.items) {
        $repoFullName = $repo.full_name
        if ($repoFullName -ne 'anthropics/skills') {
            Write-Host "  -> Repositorio comunitario: $repoFullName (Stars: $($repo.stargazers_count))" -ForegroundColor Gray
            
            # Checa se possui pasta 'skills' ou '.claude/skills'
            $skillsPathUrl = 'https://api.github.com/repos/' + $repoFullName + '/contents/skills'
            $repoItems = Invoke-GitHubApi -Uri $skillsPathUrl -Headers $headers
            if (-not $repoItems) {
                $skillsPathUrl = 'https://api.github.com/repos/' + $repoFullName + '/contents/.claude/skills'
                $repoItems = Invoke-GitHubApi -Uri $skillsPathUrl -Headers $headers
            }

            if ($repoItems) {
                foreach ($item in $repoItems) {
                    if ($item.type -eq 'dir' -and -not ($item.name.StartsWith('.')) -and ($ignoredDirs -notcontains $item.name.ToLower())) {
                        $alreadyFound = $discoveredSkills | Where-Object { $_.Name -eq $item.name }
                        if (-not $alreadyFound) {
                            $isLocal = $localSkills.ContainsKey($item.name)
                            $discoveredSkills.Add([PSCustomObject]@{
                                Name        = $item.name
                                SourceRepo  = $repoFullName
                                SourceType  = 'Topico Comunitario'
                                HtmlUrl     = $item.html_url
                                IsInstalled = $isLocal
                                Description = $repo.description
                            })
                        }
                    }
                }
            }
        }
    }
}

# 5. Exibir Resumo no Terminal
Write-Host ''
Write-Host '==========================================================' -ForegroundColor Green
Write-Host '  RESULTADO DA VARREDURA' -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Green

$newSkills = $discoveredSkills | Where-Object { -not $_.IsInstalled }
$installedSkills = $discoveredSkills | Where-Object { $_.IsInstalled }

Write-Host "Total de skills mapeadas no ecossistema: $($discoveredSkills.Count)"
Write-Host "  - Ja presentes no Maleta.dev: $($installedSkills.Count)" -ForegroundColor Cyan
Write-Host "  - Novas skills potenciais:    $($newSkills.Count)" -ForegroundColor Yellow
Write-Host ''

if ($newSkills.Count -gt 0) {
    Write-Host '--- NOVAS SKILLS DESCOBERTAS ---' -ForegroundColor Yellow
    foreach ($s in $newSkills) {
        $msg = ' [NOVA] ' + $s.Name.PadRight(32) + ' | ' + $s.SourceRepo.PadRight(30) + ' | ' + $s.HtmlUrl
        Write-Host $msg -ForegroundColor Yellow
    }
    Write-Host ''
}

# 6. Exportar Relatorio Markdown se solicitado
if ($ExportReport) {
    $reportDir = Split-Path -Parent $ExportReport
    if ($reportDir -and -not (Test-Path $reportDir)) {
        New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
    }

    $mdLines = @()
    $mdLines += '# Relatorio de Descoberta de Skills (Anthropic e Comunidade)'
    $mdLines += ''
    $mdLines += ("> **Data:** " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + "  ")
    $mdLines += ("> **Total Mapeado:** " + $discoveredSkills.Count + " skills  ")
    $mdLines += ("> **Novas Descobertas:** " + $newSkills.Count + " skills  ")
    $mdLines += ''
    $mdLines += '## Novas Skills Encontradas (Nao Instaladas)'
    $mdLines += ''
    $mdLines += '| Skill | Fonte | Tipo | Link Upstream |'
    $mdLines += '|---|---|---|---|'
    foreach ($s in $newSkills) {
        $mdLines += ('| `' + $s.Name + '` | ' + $s.SourceRepo + ' | ' + $s.SourceType + ' | [Acessar](' + $s.HtmlUrl + ') |')
    }
    $mdLines += ''
    $mdLines += '## Skills ja presentes no Maleta.dev'
    $mdLines += ''
    $mdLines += '| Skill | Fonte | Status |'
    $mdLines += '|---|---|---|---|'
    foreach ($s in $installedSkills) {
        $mdLines += ('| `' + $s.Name + '` | ' + $s.SourceRepo + ' | Instalada |')
    }

    $mdLines | Out-File -FilePath $ExportReport -Encoding utf8
    Write-Host "Relatorio exportado com sucesso para: $ExportReport" -ForegroundColor Green
}
