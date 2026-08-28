import Reveal from "@/components/Reveal";
import { PLUGIN_GROUPS } from "@/lib/data";

export default function PluginsSection() {
  return (
    <Reveal id="plugins" className="reveal" ariaLabelledby="plugins-heading">
      <h2 id="plugins-heading">Plugins</h2>
      <p>O que o instalador registra em cada ferramenta.</p>
      <div className="plugin-groups">
        {PLUGIN_GROUPS.map((group) => (
          <div key={group.tool} className="plugin-group">
            <h3>
              {group.tool} ({group.items.length})
            </h3>
            <ul>
              {group.items.map((plugin) => (
                <li key={plugin.name}>
                  <strong>{plugin.name}</strong> — {plugin.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
