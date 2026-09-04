import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Maleta.dev — AI Toolkit para Claude Code e Codex";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#000000",
          color: "#eeeeee",
          fontFamily: "monospace",
          padding: "96px",
        }}
      >
        <div style={{ fontSize: 28, color: "#7e7e7e" }}>{"// maleta.dev"}</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 16 }}>AI Toolkit</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 34,
            color: "#b4b4b4",
            marginTop: 24,
            lineHeight: 1.4,
          }}
        >
          <span>Skills, plugins e configurações instaláveis</span>
          <span>para Claude Code e Codex — 100% local.</span>
        </div>
      </div>
    ),
    size,
  );
}
