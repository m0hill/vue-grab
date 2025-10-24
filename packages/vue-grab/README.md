# Vue Grab

Grab any element in your Vue app and give it to Cursor, Claude Code, etc. to change.

By default coding agents cannot access elements on your page. Vue Grab fixes this - just point and click to provide context!

- Hold <kbd>⌘C</kbd> and click on any element on your page
- Works with Cursor, Claude Code, OpenCode
- Just a single script tag (it's just JavaScript!)

## Install

Get started in 1 minute by adding this script tag to your app:

```html
<script
  src="//unpkg.com/vue-grab/dist/index.global.js"
  crossorigin="anonymous"
  data-enabled="true"
></script>
```

If you're using a Vue framework or build tool, view instructions below:

### Vite

1. Run `npm i vue-grab@latest`
2. Add this to your `vite.config.ts`:

```ts
// ...
import { vueGrab } from "vue-grab/plugins/vite";

export default defineConfig({
  plugins: [
    vue(),
    // add vue grab as a plugin
    vueGrab(),
  ],
});
```

### Nuxt

Add this inside of your `app.vue` or layout file:

```vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  useHead({
    script: [
      {
        src: "//unpkg.com/vue-grab/dist/index.global.js",
        crossorigin: "anonymous",
        "data-enabled": "true",
      },
    ],
  });
}
</script>
```

## How it Works

Vue Grab works by:

1. Listening for a keyboard shortcut (default: Cmd+C held for 500ms)
2. Showing an overlay on elements you hover over
3. When you click, it grabs the element's HTML structure and Vue component information
4. Copies it to your clipboard in a format optimized for AI coding assistants
5. Optionally opens Cursor or other tools with the context

## Configuration

You can configure Vue Grab with data attributes:

```html
<script
  src="//unpkg.com/vue-grab/dist/index.global.js"
  crossorigin="anonymous"
  data-enabled="true"
  data-adapter="cursor"
  data-hotkey="Meta,G"
  data-key-hold-duration="300"
></script>
```

Or programmatically:

```ts
import { init } from "vue-grab";

init({
  enabled: true,
  adapter: cursorAdapter,
  hotkey: ["Meta", "G"],
  keyHoldDuration: 300,
});
```

## Credits

Vue Grab is inspired by and adapted from [React Grab](https://github.com/aidenybai/react-grab) by Aiden Bai.

## License

Vue Grab is MIT-licensed open-source software.
