<template>
  <div class="todo-list">
    <h2>Todo List</h2>

    <div class="input-group">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        type="text"
        placeholder="Enter a new todo"
      />
      <button @click="addTodo">Add</button>
    </div>

    <div v-if="todos.length > 0" class="todos">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="todo-item"
        :class="{ completed: todo.done }"
      >
        <input type="checkbox" v-model="todo.done" :id="`todo-${todo.id}`" />
        <label :for="`todo-${todo.id}`">{{ todo.text }}</label>
        <button @click="removeTodo(todo.id)" class="delete-btn">Delete</button>
      </div>
    </div>

    <p v-else class="empty">No todos yet. Add one above!</p>

    <div class="stats">
      <span>Total: {{ todos.length }}</span>
      <span>Completed: {{ completedCount }}</span>
      <span>Pending: {{ pendingCount }}</span>
    </div>
  </div>
</template>

<script setup>
const newTodo = ref("");
const nextId = ref(4);
const todos = ref([
  { id: 1, text: "Learn Nuxt 3", done: true },
  { id: 2, text: "Test vue-grab with Nuxt", done: false },
  { id: 3, text: "Build awesome apps", done: false },
]);

const completedCount = computed(() => todos.value.filter((t) => t.done).length);
const pendingCount = computed(() => todos.value.filter((t) => !t.done).length);

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId.value++,
      text: newTodo.value.trim(),
      done: false,
    });
    newTodo.value = "";
  }
};

const removeTodo = (id) => {
  todos.value = todos.value.filter((t) => t.id !== id);
};
</script>

<style scoped>
.todo-list {
  padding: 20px;
  background: white;
  border: 2px solid #42b983;
  border-radius: 8px;
  margin: 20px 0;
}

h2 {
  color: #42b983;
  margin-top: 0;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

.todos {
  margin: 20px 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 8px;
}

.todo-item.completed label {
  text-decoration: line-through;
  color: #9ca3af;
}

label {
  flex: 1;
  cursor: pointer;
}

.delete-btn {
  padding: 6px 12px;
  background: #ef4444;
  font-size: 12px;
}

.delete-btn:hover {
  background: #dc2626;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 20px;
  font-style: italic;
}

.stats {
  display: flex;
  gap: 20px;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}
</style>
