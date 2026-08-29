<#
.SYNOPSIS
    Instalador One-Liner do maleta.dev para Claude Code e opencode.

.DESCRIPTION
    Instala skills, plugins, marketplaces e configuracoes de IA.
    Pode ser executado diretamente da web sem necessidade de clonar o repositorio antes:
        irm https://maleta.dev/install.ps1 | iex

    Ou com parametros customizados:
        & ([scriptblock]::Create((irm https://maleta.dev/install.ps1))) -Tools claude -Skills @('design-taste-frontend','emil-design-eng')

.PARAMETER Tools
    Quais ferramentas instalar: 'all', 'claude', 'opencode', 'agents'.
    Padrao: 'all' (Claude Code + opencode + Universal Agents).

.PARAMETER Skills
    Array opcional com nomes das skills para instalar.
    Se omitido, instala todas as skills curadas.

.PARAMETER Plugins
    Array opcional com nomes dos plugins do opencode para instalar.
    Se omitido, instala todos os plugins curados do opencode.

.PARAMETER Force
    Sobrescreve configuracoes sem pedir confirmacao.
#>
[CmdletBinding()]
param(
    [string[]]$Tools = @('all'),
    [string[]]$Skills = @(),
    [string[]]$Plugins = @(),
    [switch]$Force,
    [string]$RepoRoot = ''
)

$ErrorActionPreference = 'Stop'

function Write-BoxLine {
    param([string]$Text = '', [string]$Color = 'White', [int]$Width = 58)
    $pad = $Width - $Text.Length
    if ($pad -lt 0) { $pad = 0 }
    Write-Host ("  | " + $Text + (' ' * $pad) + " |") -ForegroundColor $Color
}

function Write-BrandBanner {
    Write-Host ""
    Write-Host "  __  __       _      _            _             " -ForegroundColor Cyan
    Write-Host " |  \/  |     | |    | |          | |            " -ForegroundColor Cyan
    Write-Host " | \  / | __ _| | ___| |_ __ _  __| | _____   __ " -ForegroundColor Cyan
    Write-Host " | |\/| |/ _` | |/ _ \ __/ _` |/ _` |/ _ \ \ / / " -ForegroundColor Cyan
    Write-Host " | |  | | (_| | |  __/ || (_| | (_| |  __/\ V /  " -ForegroundColor Cyan
    Write-Host " |_|  |_|\__,_|_|\___|\__\__,_|\__,_|\___| \_/   " -ForegroundColor Cyan
    $border = '  +' + ('-' * 60) + '+'
    Write-Host $border -ForegroundColor DarkCyan
    Write-BoxLine -Text 'Skills, plugins e configs de IA prontos para instalar' -Color DarkGray
    Write-BoxLine -Text 'https://maleta.dev' -Color DarkCyan
    Write-Host $border -ForegroundColor DarkCyan
    Write-Host ""
}

function Write-Step {
    param([int]$Index, [int]$Total, [string]$Text)
    Write-Host "[$Index/$Total] $Text" -ForegroundColor Yellow
}

function Write-Info { param([string]$Text) Write-Host "[info] $Text" -ForegroundColor Cyan }
function Write-Ok   { param([string]$Text) Write-Host "[ok]   $Text" -ForegroundColor Green }
function Write-Warn { param([string]$Text) Write-Host "[warn] $Text" -ForegroundColor DarkYellow }
function Write-Err  { param([string]$Text) Write-Host "[erro] $Text" -ForegroundColor Red }

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
        Write-Info "Baixando pacote mais recente do maleta.dev..."
        $zipUrl = "https://github.com/diego-ruas/maleta.dev/archive/refs/heads/main.zip"
        $randSuffix = [System.IO.Path]::GetRandomFileName()
        $tempDir = Join-Path $env:TEMP "maleta-dev-$randSuffix"
        $zipFile = Join-Path $env:TEMP "maleta-dev-$randSuffix.zip"

        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile -UseBasicParsing

        Write-Info "Extraindo arquivos..."
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
        $toolsToRun = @('claude', 'opencode', 'agents')
    } else {
        $toolsToRun = $Tools
    }

    $totalSteps = $toolsToRun.Count
    $stepIndex = 0

    # 2. Executar instalacao do Claude Code
    if ($toolsToRun -contains 'claude') {
        $stepIndex++
        Write-Step -Index $stepIndex -Total $totalSteps -Text 'Claude Code'
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
                Write-Info "Instalando $($Skills.Count) skills selecionadas..."
            }

            & $claudeInstallScript -RepoRoot $RepoRoot

            # Restaurar estado original se aplicavel
            if (-not $hadOriginalSelection -and (Test-Path $selectionFile)) {
                Remove-Item -LiteralPath $selectionFile -Force -ErrorAction SilentlyContinue
            } elseif ($hadOriginalSelection -and $originalSelectionContent) {
                $originalSelectionContent | Set-Content -LiteralPath $selectionFile -Encoding UTF8
            }
            Write-Ok "Claude Code configurado."
        } else {
            Write-Warn "Script do Claude nao encontrado em $claudeInstallScript"
        }
        Write-Host ""
    }

    # 3. Executar instalacao do opencode
    if ($toolsToRun -contains 'opencode') {
        $stepIndex++
        Write-Step -Index $stepIndex -Total $totalSteps -Text 'opencode'
        $opencodeInstallScript = Join-Path $RepoRoot 'opencode\install.ps1'
        if (Test-Path $opencodeInstallScript) {
            if ($Plugins -and $Plugins.Count -gt 0) {
                & $opencodeInstallScript -RepoRoot $RepoRoot -Plugins $Plugins
            } else {
                & $opencodeInstallScript -RepoRoot $RepoRoot
            }
            Write-Ok "opencode configurado."
        } else {
            Write-Warn "Script do opencode nao encontrado em $opencodeInstallScript"
        }
        Write-Host ""
    }

    # 4. Executar instalacao de Universal Agents (~/.agents, Cursor, Windsurf, Cline)
    if ($toolsToRun -contains 'agents') {
        $stepIndex++
        Write-Step -Index $stepIndex -Total $totalSteps -Text 'Universal Agents (~/.agents, IDEs)'
        $agentsInstallScript = Join-Path $RepoRoot 'agents\install.ps1'
        if (Test-Path $agentsInstallScript) {
            # Se skills foram especificadas, gravar temporariamente o arquivo de selecao
            $selectionFile = Join-Path $RepoRoot 'claude\skills-selection.txt'
            $hadOriginalSelection = Test-Path $selectionFile
            $originalSelectionContent = $null
            if ($hadOriginalSelection) {
                $originalSelectionContent = Get-Content -LiteralPath $selectionFile -Raw
            }

            if ($Skills -and $Skills.Count -gt 0) {
                $Skills | Set-Content -LiteralPath $selectionFile -Encoding UTF8
            }

            & $agentsInstallScript -RepoRoot $RepoRoot

            if (-not $hadOriginalSelection -and (Test-Path $selectionFile)) {
                Remove-Item -LiteralPath $selectionFile -Force -ErrorAction SilentlyContinue
            } elseif ($hadOriginalSelection -and $originalSelectionContent) {
                $originalSelectionContent | Set-Content -LiteralPath $selectionFile -Encoding UTF8
            }
            Write-Ok "Universal Agents configurado (~/.agents/skills, ~/.agents/AGENTS.md, IDE rules)."
        } else {
            Write-Warn "Script universal de agents nao encontrado em $agentsInstallScript"
        }
        Write-Host ""
    }

    $border = '  +' + ('-' * 60) + '+'
    Write-Host $border -ForegroundColor Green
    Write-BoxLine -Text 'Instalacao concluida com sucesso!' -Color Green
    Write-Host $border -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    if ($toolsToRun -contains 'claude') {
        Write-Host "  * Claude Code: reinicie sua sessao e digite '/skills' ou '/plugins' para conferir." -ForegroundColor White
    }
    if ($toolsToRun -contains 'opencode') {
        Write-Host "  * opencode: reinicie o opencode para carregar plugins e o MCP open-websearch." -ForegroundColor White
    }
    if ($toolsToRun -contains 'agents') {
        Write-Host "  * Universal Agents: skills disponiveis em ~/.agents/skills e regras em ~/.agents/AGENTS.md." -ForegroundColor White
    }
    Write-Host ""
}
finally {
    if ($isRemote -and $tempDir -and (Test-Path $tempDir)) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
