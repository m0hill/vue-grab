<template>
  <div class="todo-list-composition">
    <h2>Todo List (Composition API)</h2>

    <div class="input-group">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Enter a new todo"
        type="text"
      />
      <button @click="addTodo">Add Todo</button>
    </div>

    <ul v-if="todos.length > 0">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
          :id="`todo-comp-${todo.id}`"
        />
        <label :for="`todo-comp-${todo.id}`">{{ todo.text }}</label>
        <button @click="removeTodo(todo.id)" class="delete-btn">Delete</button>
      </li>
    </ul>

    <p v-else class="empty-state">No todos yet. Add one above!</p>

    <div class="stats">
      <span>Total: {{ totalCount }}</span>
      <span>Completed: {{ completedCount }}</span>
      <span>Pending: {{ pendingCount }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "TodoListComposition",
  setup() {
    const newTodo = ref("");
    const nextId = ref(4);
    const todos = ref([
      { id: 1, text: "Learn Vue 2.7 Composition API", completed: true },
      { id: 2, text: "Use ref and computed", completed: false },
      { id: 3, text: "Test with vue-grab", completed: false },
    ]);

    const totalCount = computed(() => todos.value.length);
    const completedCount = computed(
      () => todos.value.filter((t) => t.completed).length,
    );
    const pendingCount = computed(
      () => todos.value.filter((t) => !t.completed).length,
    );

    const addTodo = () => {
      if (newTodo.value.trim()) {
        todos.value.push({
          id: nextId.value++,
          text: newTodo.value.trim(),
          completed: false,
        });
        newTodo.value = "";
      }
    };

    const removeTodo = (id) => {
      todos.value = todos.value.filter((t) => t.id !== id);
    };

    return {
      newTodo,
      todos,
      totalCount,
      completedCount,
      pendingCount,
      addTodo,
      removeTodo,
    };
  },
};
</script>

<style scoped>
.todo-list-composition {
  padding: 20px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  background: #f9fafb;
  margin-bottom: 20px;
}

h2 {
  color: #3b82f6;
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

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 8px;
}

li.completed label {
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

.empty-state {
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
