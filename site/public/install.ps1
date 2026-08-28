<#
.SYNOPSIS
    Instalador One-Liner do maleta.dev para Claude Code, opencode e Antigravity.

.DESCRIPTION
    Instala skills, plugins, marketplaces e configuracoes de IA.
    Pode ser executado diretamente da web sem necessidade de clonar o repositorio antes:
        irm https://maleta.dev/install.ps1 | iex

    Ou com parametros customizados:
        & ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills @('design-taste-frontend','emil-design-eng')

.PARAMETER Tools
    Quais ferramentas instalar: 'all', 'claude', 'opencode', 'antigravity'.
    Padrao: 'all' (Claude Code + opencode + Antigravity).

.PARAMETER Skills
    Array opcional com nomes das skills do Claude para instalar.
    Se omitido, instala todas as 82 skills.

.PARAMETER Force
    Sobrescreve configuracoes sem pedir confirmacao.
#>
[CmdletBinding()]
param(
    [string[]]$Tools = @('all'),
    [string[]]$Skills = @(),
    [switch]$Force,
    [string]$RepoRoot = ''
)

$ErrorActionPreference = 'Stop'

function Write-BrandBanner {
    Write-Host ""
    Write-Host "  __  __       _      _            _             " -ForegroundColor Cyan
    Write-Host " |  \/  |     | |    | |          | |            " -ForegroundColor Cyan
    Write-Host " | \  / | __ _| | ___| |_ __ _  __| | _____   __ " -ForegroundColor Cyan
    Write-Host " | |\/| |/ _` | |/ _ \ __/ _` |/ _` |/ _ \ \ / / " -ForegroundColor Cyan
    Write-Host " | |  | | (_| | |  __/ || (_| | (_| |  __/\ V /  " -ForegroundColor Cyan
    Write-Host " |_|  |_|\__,_|_|\___|\__\__,_|\__,_|\___| \_/   " -ForegroundColor Cyan
    Write-Host "  Skills, plugins e configs de IA prontos para instalar" -ForegroundColor DarkGray
    Write-Host "  https://maleta.dev" -ForegroundColor DarkCyan
    Write-Host ""
}

Write-BrandBanner

$isRemote = $false
$tempDir = $null

try {
    # 1. Determinar raiz do repositorio (local ou download remoto)
    if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
        $candidate = $PSScriptRoot
        if ($candidate -and (Test-Path (Join-Path $candidate 'claude\skills'))) {
            $RepoRoot = $candidate
        } elseif ($candidate -and (Test-Path (Join-Path (Split-Path -Parent $candidate) 'claude\skills'))) {
            $RepoRoot = Split-Path -Parent $candidate
        } else {
            $isRemote = $true
        }
    }

    if ($isRemote) {
        Write-Host "[info] Baixando pacote mais recente do maleta.dev..." -ForegroundColor Cyan
        $zipUrl = "https://github.com/diego-ruas/maleta.dev/archive/refs/heads/main.zip"
        $randSuffix = [System.IO.Path]::GetRandomFileName()
        $tempDir = Join-Path $env:TEMP "maleta-dev-$randSuffix"
        $zipFile = Join-Path $env:TEMP "maleta-dev-$randSuffix.zip"

        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile -UseBasicParsing

        Write-Host "[info] Extraindo arquivos..." -ForegroundColor Cyan
        Expand-Archive -Path $zipFile -DestinationPath $tempDir -Force
        Remove-Item -Path $zipFile -Force -ErrorAction SilentlyContinue

        $extractedRoot = Get-ChildItem -Path $tempDir -Directory | Select-Object -First 1
        if ($extractedRoot) {
            $RepoRoot = $extractedRoot.FullName
        } else {
            $RepoRoot = $tempDir
        }
    }

    $toolsToRun = @()
    if ($Tools -contains 'all') {
        $toolsToRun = @('claude', 'opencode', 'antigravity')
    } else {
        $toolsToRun = $Tools
    }

    # 2. Executar instalacao do Claude Code
    if ($toolsToRun -contains 'claude') {
        Write-Host "===== Claude Code =====" -ForegroundColor Yellow
        $claudeInstallScript = Join-Path $RepoRoot 'claude\install.ps1'
        if (Test-Path $claudeInstallScript) {
            # Se skills foram especificadas, gravar temporariamente o arquivo de selecao
            $selectionFile = Join-Path $RepoRoot 'claude\skills-selection.txt'
            $hadOriginalSelection = Test-Path $selectionFile
            $originalSelectionContent = $null
            if ($hadOriginalSelection) {
                $originalSelectionContent = Get-Content -LiteralPath $selectionFile -Raw
            }

            if ($Skills -and $Skills.Count -gt 0) {
                $Skills | Set-Content -LiteralPath $selectionFile -Encoding UTF8
                Write-Host "[info] Instalando $($Skills.Count) skills selecionadas..." -ForegroundColor Cyan
            }

            & $claudeInstallScript -RepoRoot $RepoRoot

            # Restaurar estado original se aplicavel
            if (-not $hadOriginalSelection -and (Test-Path $selectionFile)) {
                Remove-Item -LiteralPath $selectionFile -Force -ErrorAction SilentlyContinue
            } elseif ($hadOriginalSelection -and $originalSelectionContent) {
                $originalSelectionContent | Set-Content -LiteralPath $selectionFile -Encoding UTF8
            }
        } else {
            Write-Host "[warn] Script do Claude nao encontrado em $claudeInstallScript" -ForegroundColor DarkYellow
        }
        Write-Host ""
    }

    # 3. Executar instalacao do opencode
    if ($toolsToRun -contains 'opencode') {
        Write-Host "===== opencode =====" -ForegroundColor Yellow
        $opencodeInstallScript = Join-Path $RepoRoot 'opencode\install.ps1'
        if (Test-Path $opencodeInstallScript) {
            & $opencodeInstallScript -RepoRoot $RepoRoot
        } else {
            Write-Host "[warn] Script do opencode nao encontrado em $opencodeInstallScript" -ForegroundColor DarkYellow
        }
        Write-Host ""
    }

    # 4. Executar instalacao do Antigravity
    if ($toolsToRun -contains 'antigravity') {
        Write-Host "===== Antigravity =====" -ForegroundColor Yellow
        $antigravityInstallScript = Join-Path $RepoRoot 'antigravity\install.ps1'
        if (Test-Path $antigravityInstallScript) {
            & $antigravityInstallScript -RepoRoot $RepoRoot
        }
        Write-Host ""
    }

    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  Instalacao concluida com sucesso!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    if ($toolsToRun -contains 'claude') {
        Write-Host "  * Claude Code: reinicie sua sessao e digite '/skills' ou '/plugins' para conferir." -ForegroundColor White
    }
    if ($toolsToRun -contains 'opencode') {
        Write-Host "  * opencode: reinicie o opencode para carregar plugins e o MCP open-websearch." -ForegroundColor White
    }
    Write-Host ""
}
finally {
    if ($isRemote -and $tempDir -and (Test-Path $tempDir)) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
