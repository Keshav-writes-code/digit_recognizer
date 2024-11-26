// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [UnoCSS({
    injectReset: true,
  }), svelte(), tailwind()],
  site: "https://Keshav-writes-code.github.io",
  base: "digit_recognizer",
});