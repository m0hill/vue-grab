<template>
  <div id="app">
    <header>
      <h1>Vue 2.7 Demo - Vue Grab Testing</h1>
      <p>
        This app demonstrates both Options API and Composition API components in
        Vue 2.7
      </p>
      <p class="hint">⌘⇧E to inspect any element</p>
    </header>

    <main>
      <section class="options-section">
        <h2 class="section-title">Options API Components (Green)</h2>
        <CounterOptions />
        <TodoListOptions />
      </section>

      <section class="composition-section">
        <h2 class="section-title">Composition API Components (Blue)</h2>
        <CounterComposition />
        <TodoListComposition />
        <FormComposition />
      </section>
    </main>

    <footer>
      <p>Built with Vue 2.7 | Testing vue-grab</p>
    </footer>
  </div>
</template>

<script>
import CounterOptions from "./components/options/CounterOptions.vue";
import TodoListOptions from "./components/options/TodoListOptions.vue";
import CounterComposition from "./components/composition/CounterComposition.vue";
import TodoListComposition from "./components/composition/TodoListComposition.vue";
import FormComposition from "./components/composition/FormComposition.vue";

export default {
  name: "App",
  components: {
    CounterOptions,
    TodoListOptions,
    CounterComposition,
    TodoListComposition,
    FormComposition,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
  background: #f5f5f5;
  color: #2c3e50;
}

#app {
  max-width: 1200px;
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

header p {
  font-size: 1.1rem;
  opacity: 0.95;
  margin-bottom: 5px;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.8;
  font-style: italic;
}

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

@media (max-width: 1024px) {
  main {
    grid-template-columns: 1fr;
  }
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid;
}

.options-section .section-title {
  color: #42b983;
  border-color: #42b983;
}

.composition-section .section-title {
  color: #3b82f6;
  border-color: #3b82f6;
}

footer {
  text-align: center;
  padding: 20px;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
}
</style>
