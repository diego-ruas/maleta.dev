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
          <div className="plugin-highlight-layout">
            <div className="plugin-highlight-copy">
              <span className="plugin-highlight-label">{"// PLUGIN PARA CODEX"}</span>
              <h2 id="plugin-codex-heading">Monte seu kit sem decorar comandos.</h2>
              <p>
                O plugin <code>maleta-dev</code> orienta a escolha de presets e skills para o seu contexto e gera um comando de instalação para revisão.
              </p>
            </div>
            <div className="plugin-highlight-details">
              <span className="plugin-highlight-label">{"// COMO FUNCIONA"}</span>
              <ol>
                <li>Explique o que você quer montar.</li>
                <li>Revise as sugestões de skills e presets.</li>
                <li>Copie o comando final quando estiver pronto.</li>
              </ol>
              <span className="plugin-highlight-note">Nada é executado sem sua confirmação.</span>
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
