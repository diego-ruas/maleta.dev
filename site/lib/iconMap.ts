import { EyeIcon } from "@/components/icons/eye";
import { SparklesIcon } from "@/components/icons/sparkles";
import { CloudIcon } from "@/components/icons/cloud";
import { LayoutIcon } from "@/components/icons/layout";
import { NotesIcon } from "@/components/icons/notes";
import { ShieldIcon } from "@/components/icons/shield";
import { TerminalIcon } from "@/components/icons/terminal";
import { CodeIcon } from "@/components/icons/code";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";

export function getCategoryIcon(category: string) {
  switch (category) {
    case "Acessibilidade":
      return EyeIcon;
    case "Animações":
      return SparklesIcon;
    case "Cloudflare":
      return CloudIcon;
    case "Design UI":
      return LayoutIcon;
    case "Documentos":
    case "Escrita":
      return NotesIcon;
    case "Testes":
      return ShieldIcon;
    case "Ferramentas":
      return TerminalIcon;
    case "all":
      return SlidersHorizontalIcon;
    default:
      return CodeIcon;
  }
}
