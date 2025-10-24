<template>
  <div class="counter-options">
    <h2>Counter (Options API)</h2>
    <p>Count: {{ count }}</p>
    <div class="button-group">
      <button @click="increment">Increment</button>
      <button @click="decrement">Decrement</button>
      <button @click="reset">Reset</button>
    </div>
    <p class="description">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "CounterOptions",
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    message() {
      if (this.count === 0) return "Start counting!";
      if (this.count > 0) return `You clicked ${this.count} times`;
      return `Negative: ${this.count}`;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    reset() {
      this.count = 0;
    },
  },
};
</script>

<style scoped>
.counter-options {
  padding: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  background: #f0f9ff;
  margin-bottom: 20px;
}

h2 {
  color: #42b983;
  margin-top: 0;
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #35a372;
}

.description {
  color: #2c3e50;
  font-style: italic;
}
</style>
