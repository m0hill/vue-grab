<template>
  <div class="counter">
    <h2>Counter Component</h2>
    <p class="count">Count: {{ count }}</p>
    <div class="buttons">
      <button @click="increment">Increment</button>
      <button @click="decrement">Decrement</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup>
const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};

const reset = () => {
  count.value = 0;
};
</script>

<style scoped>
.counter {
  padding: 20px;
  background: #f0f9ff;
  border: 2px solid #42b983;
  border-radius: 8px;
  margin: 20px 0;
}

h2 {
  color: #42b983;
  margin-top: 0;
}

.count {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.buttons {
  display: flex;
  gap: 10px;
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
</style>
