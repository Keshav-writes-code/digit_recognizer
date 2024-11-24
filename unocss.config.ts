// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUno } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
import {transformerVariantGroup} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetDaisy({
      themes: ["dark"],
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})