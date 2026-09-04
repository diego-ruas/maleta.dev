import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (file) => readFile(new URL(file, root), "utf8");

function luminance(hex) {
  const channels = [0, 2, 4]
    .map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

async function tokens() {
  const base = await source("css/base.css");
  const found = {};
  for (const [, name, value] of base.matchAll(/(--color-[\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    found[name] = value.toLowerCase();
  }
  return found;
}

test("accent e error passam AA sobre as duas superficies de fundo", async () => {
  const { "--color-accent": accent, "--color-error": error, "--color-void": void_, "--color-carbon": carbon } =
    await tokens();

  for (const [name, color] of [["accent", accent], ["error", error]]) {
    for (const [surface, bg] of [["void", void_], ["carbon", carbon]]) {
      const ratio = contrast(color, bg);
      assert.ok(ratio >= 4.5, `${name} sobre ${surface}: ${ratio.toFixed(2)}:1, abaixo de 4.5`);
    }
  }

  // O CTA primario pinta --color-void sobre --color-accent; o mesmo par, invertido.
  assert.ok(contrast(void_, accent) >= 4.5);
});

test("erro se distingue do accent por luminancia, ja que a matiz e vizinha", async () => {
  const { "--color-accent": accent, "--color-error": error } = await tokens();
  // Matiz nao separa os dois. Se a luminancia tambem nao separar, um estado de
  // falha fica indistinguivel de um CTA — inclusive para quem nao discrimina
  // vermelho/laranja.
  const ratio = contrast(error, accent);
  assert.ok(ratio >= 1.4, `error vs accent: ${ratio.toFixed(2)}:1, indistinguiveis`);
});

test("nenhuma cor solta fora de base.css", async () => {
  const css = await source("css/site.css");
  const strays = [...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
  assert.deepEqual(strays, [], `hex fora dos tokens: ${strays.join(", ")}`);
});
