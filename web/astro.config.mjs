// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    tailwind(),
    UnoCSS({
      injectReset: true,
    }),
    svelte()
  ],
  site: "https://Keshav-writes-code.github.io",
  base: "digit_recognizer",
});