import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import { vueGrab } from "vue-grab/vite";

export default defineConfig({
  plugins: [
    vue(),
    vueGrab({
      scriptSrc: "/node_modules/vue-grab/dist/index.global.js",
    }),
  ],
});
