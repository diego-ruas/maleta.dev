export default function PluginHighlight() {
  return (
    <section id="plugin-codex" className="plugin-highlight" aria-labelledby="plugin-codex-heading">
      <div className="plugin-highlight-layout">
        <div className="plugin-highlight-copy">
          <span className="plugin-highlight-label">{"// PLUGIN PARA CODEX"}</span>
          <h2 id="plugin-codex-heading">Monte seu kit sem decorar comandos.</h2>
          <p>
            O <code>maleta-dev</code> transforma sua ideia em uma seleção revisável de presets, skills e comandos de instalação.
          </p>
          <p>
            Você descreve o tipo de projeto, confere as recomendações e decide quando o comando deve ser executado.
          </p>
        </div>
        <div className="plugin-highlight-cta">
          <span className="plugin-highlight-cta-label">{"// PRONTO PARA COMEÇAR?"}</span>
          <a href="#plugins" className="plugin-highlight-link">
            Ver como instalar <span aria-hidden="true">&rarr;</span>
          </a>
          <span className="plugin-highlight-note">Nada é executado sem sua confirmação.</span>
        </div>
      </div>
    </section>
  );
}
