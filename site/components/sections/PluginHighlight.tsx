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
          <div className="plugin-highlight-copy">
            <span className="plugin-highlight-label">{"// PLUGIN PARA CODEX"}</span>
            <h2 id="plugin-codex-heading">Monte seu kit sem decorar comandos.</h2>
            <p>
              O plugin <code>maleta-dev</code> ajuda a escolher presets e skills, depois gera o comando certo para você revisar antes de executar.
            </p>
          </div>
          <a href="#plugins" className="plugin-highlight-link">
            Ver como instalar <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
