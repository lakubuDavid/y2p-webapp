import { defineConfig, presetMini, presetTagify } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets:[
    presetMini(),
    presetTagify()
  ]
})
