import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import path from "path"

const currentDir = import.meta.dir;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    vueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: true, // or a custom path,
      imports: [
        // presets
        "vue",
        "vue-router",
      ],
      dirs: [
        // './hooks',
        // './composables' // only root modules
        "./src/composables/**", // all nested modules
        "./src/components/**", // all nested modules
        "./src/layouts/**", // all nested modules
        "./src/pages/**", // all nested modules
        // ...
      ],
    }),
  ],
  resolve:{
    alias:{
      '@': path.resolve(currentDir, "./"),
      '@layouts': path.resolve(currentDir, "./src/layouts"),
      '@pages': path.resolve(currentDir, "./src/pages"),
      '@stores': path.resolve(currentDir, "./src/stores"),
      '@components': path.resolve(currentDir, "./src/components"),
      '@lib': path.resolve(currentDir, "./lib"),
    }
  }
});
