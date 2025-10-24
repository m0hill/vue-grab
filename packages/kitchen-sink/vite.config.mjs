import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vueGrab } from "vue-grab/plugins/vite";

export default defineConfig({
  plugins: [
    vue(),
    vueGrab({
      scriptSrc: "/node_modules/vue-grab/dist/index.global.js",
    }),
  ],
});