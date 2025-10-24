<template>
  <div>
    <div class="container">
      <header>
        <h1>Nuxt 3 + Vue Grab Demo</h1>
        <p class="hint">
          Hold ⌘C (Mac) or Ctrl+C (Windows/Linux) for 500ms, then hover and
          click
        </p>
      </header>

      <Counter />
      <TodoList />
    </div>
  </div>
</template>

<script setup>
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  useHead({
    script: [
      {
        src: "//unpkg.com/vue-grab@0.0.1/dist/index.global.js",
        crossorigin: "anonymous",
        "data-enabled": "true",
      },
    ],
  });
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  background: #f5f5f5;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #42b983 0%, #3b82f6 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 30px;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.9;
  font-style: italic;
}
</style>
