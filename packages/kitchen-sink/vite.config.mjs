import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vueGrab } from "vue-grab/vite";

export default defineConfig({
  plugins: [vue(), vueGrab()],
});
