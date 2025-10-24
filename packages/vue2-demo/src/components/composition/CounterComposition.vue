<template>
  <div class="counter-composition">
    <h2>Counter (Composition API)</h2>
    <p>Count: {{ count }}</p>
    <div class="button-group">
      <button @click="increment">Increment</button>
      <button @click="decrement">Decrement</button>
      <button @click="reset">Reset</button>
    </div>
    <p class="description">{{ message }}</p>
    <p class="double">Double: {{ doubleCount }}</p>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "CounterComposition",
  setup() {
    const count = ref(0);

    const message = computed(() => {
      if (count.value === 0) return "Start counting!";
      if (count.value > 0) return `You clicked ${count.value} times`;
      return `Negative: ${count.value}`;
    });

    const doubleCount = computed(() => count.value * 2);

    const increment = () => {
      count.value++;
    };

    const decrement = () => {
      count.value--;
    };

    const reset = () => {
      count.value = 0;
    };

    return {
      count,
      message,
      doubleCount,
      increment,
      decrement,
      reset,
    };
  },
};
</script>

<style scoped>
.counter-composition {
  padding: 20px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  background: #eff6ff;
  margin-bottom: 20px;
}

h2 {
  color: #3b82f6;
  margin-top: 0;
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #2563eb;
}

.description {
  color: #2c3e50;
  font-style: italic;
}

.double {
  color: #3b82f6;
  font-weight: bold;
}
</style>
