export type OsTarget = "windows" | "unix";
export type ToolTarget = "all" | "claude" | "codex" | "agents";

interface BuildOptions {
  skills: string[];
  tool: ToolTarget;
  os: OsTarget;
  /** Ids de plugins do Claude Code, anexados como `claude plugin install`. */
  plugins?: string[];
  /** Trunca a lista para preview, somando "... +N" no fim. */
  preview?: number;
}

// Nomes de skill vindos de repos de terceiros entram neste comando; o usuario
// copia e cola num shell. Quoting obrigatorio nos dois ramos.
const quoteUnix = (name: string) => `'${name.replace(/'/g, "'\\''")}'`;
const quotePwsh = (name: string) => `'${name.replace(/'/g, "''")}'`;

/** `claude plugin install <id>` para cada plugin, encadeado no shell alvo. */
function pluginSuffix(plugins: string[] | undefined, os: OsTarget): string {
  if (!plugins || plugins.length === 0) return "";
  const quote = os === "unix" ? quoteUnix : quotePwsh;
  const sep = os === "unix" ? " && " : "; ";
  return sep + plugins.map((id) => `claude plugin install ${quote(id)}`).join(sep);
}

export function buildInstallCommand({ skills, tool, os, plugins, preview }: BuildOptions): string {
  const shown = preview ? skills.slice(0, preview) : skills;
  const rest = skills.length - shown.length;
  const suffix = preview ? "" : pluginSuffix(plugins, os);

  if (os === "unix") {
    const toolFlag = tool !== "all" ? ` --tools ${quoteUnix(tool)}` : "";
    const list = shown.map(quoteUnix).join(",");
    const tail = rest > 0 ? `,… +${rest}` : "";
    return `curl -fsSL https://maleta.dev/install.sh | bash -s --${toolFlag} --skills ${list}${tail}${suffix}`;
  }

  const toolParam = tool !== "all" ? ` -Tools ${quotePwsh(tool)}` : "";
  const list = shown.map(quotePwsh).join(", ");
  const tail = rest > 0 ? `, … +${rest}` : "";
  return `& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${toolParam} -Skills @(${list}${tail})${suffix}`;
}

export function buildInstallScript(
  skills: string[],
  tool: ToolTarget,
  os: OsTarget,
  plugins: string[] = []
): { content: string; filename: string } {
  if (os === "unix") {
    return {
      filename: "instalar-maleta.sh",
      content: `#!/usr/bin/env bash
# Maleta.dev — Instalador Customizado Sob Medida
# Execute no bash/zsh (sem necessidade de git clone previo):
set -euo pipefail
echo "[maleta.dev] Instalando ${skills.length} skills customizadas..."
${buildInstallCommand({ skills, tool, os, plugins })}
`,
    };
  }

  return {
    filename: "instalar-maleta.ps1",
    content: `<#
  Maleta.dev — Instalador Customizado Sob Medida
  Execute no PowerShell (sem necessidade de admin ou git clone prévio):
#>
$ErrorActionPreference = 'Stop'
$Skills = @(
    ${skills.map(quotePwsh).join(",\n    ")}
)
Write-Host "[maleta.dev] Instalando $($Skills.Count) skills customizadas..." -ForegroundColor Cyan
& ([scriptblock]::Create((irm https://maleta.dev/install.ps1)))${
      tool !== "all" ? ` -Tools ${quotePwsh(tool)}` : ""
    } -Skills $Skills
${plugins.map((id) => `claude plugin install ${quotePwsh(id)}`).join("\n")}
`,
  };
}
