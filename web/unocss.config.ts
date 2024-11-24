// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUno } from 'unocss'
import {transformerVariantGroup} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})