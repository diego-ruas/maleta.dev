export default function PluginHighlight() {
  return (
    <section id="plugin-codex" className="plugin-highlight" aria-labelledby="plugin-codex-heading">
      <div className="hero-terminal plugin-highlight-terminal">
        <div className="hero-terminal-header">
          <div className="hero-terminal-header-left">
            <div className="terminal-dots" aria-hidden="true">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
            </div>
            <span className="terminal-title">maleta-dev</span>
          </div>
          <span className="terminal-badge">CODEX</span>
        </div>
        <div className="hero-terminal-body">
          <div className="plugin-highlight-session">
            <div className="plugin-highlight-line plugin-highlight-line-intro">
              <span className="plugin-highlight-prompt" aria-hidden="true">&gt;</span>
              <div className="plugin-highlight-copy">
                <span className="plugin-highlight-label">{"// PLUGIN PARA CODEX"}</span>
                <h2 id="plugin-codex-heading">Monte seu kit sem decorar comandos.</h2>
                <p>
                  O <code>maleta-dev</code> transforma sua ideia em uma seleção revisável de presets, skills e comandos de instalação.
                </p>
              </div>
            </div>
            <div className="plugin-highlight-line">
              <span className="plugin-highlight-prompt" aria-hidden="true">-&gt;</span>
              <div>
                <span className="plugin-highlight-label">{"// VOCÊ DESCREVE"}</span>
                <p className="plugin-highlight-line-text">O tipo de projeto e o fluxo que quer preparar.</p>
              </div>
            </div>
            <div className="plugin-highlight-line">
              <span className="plugin-highlight-prompt" aria-hidden="true">-&gt;</span>
              <div>
                <span className="plugin-highlight-label">{"// O PLUGIN ORGANIZA"}</span>
                <p className="plugin-highlight-line-text">Presets recomendados e skills compatíveis com o seu contexto.</p>
              </div>
            </div>
            <div className="plugin-highlight-line plugin-highlight-command">
              <span className="plugin-highlight-prompt" aria-hidden="true">-&gt;</span>
              <div>
                <span className="plugin-highlight-label">{"// VOCÊ REVISA"}</span>
                <p className="plugin-highlight-line-text">O comando final antes de instalar qualquer coisa.</p>
              </div>
            </div>
          </div>
          <a href="#plugins" className="plugin-highlight-link">
            Ver como instalar <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
