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
          <div className="plugin-highlight-usage">
            <span className="plugin-highlight-label">{"// COMO USAR"}</span>
            <ol>
              <li>Instale o plugin pelo marketplace do Codex.</li>
              <li>Peça um kit para o projeto que está preparando.</li>
              <li>Revise as sugestões e copie o comando final.</li>
            </ol>
          </div>
        </div>
        <div className="plugin-highlight-cta">
          <span className="plugin-highlight-cta-label">{"// PRONTO PARA COMEÇAR?"}</span>
          <p className="plugin-highlight-cta-copy">Instale uma vez e use o plugin sempre que quiser montar um novo kit.</p>
          <a href="#instalar" className="plugin-highlight-link btn-primary">
            Ver como instalar <span aria-hidden="true">&rarr;</span>
          </a>
          <span className="plugin-highlight-note">Nada é executado sem sua confirmação.</span>
        </div>
      </div>
    </section>
  );
}
