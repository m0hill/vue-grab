<template>
  <div :style="containerStyle">
    <header :style="headerStyle">
      <h1 :style="titleStyle">🎯 Vue Grab Kitchen Sink</h1>
      <p :style="subtitleStyle">
        A complex todo list demo with nested components
      </p>
      <div :style="instructionsStyle">
        <strong>Try it:</strong> Hold <kbd>⌘C</kbd> (Mac) or
        <kbd>Ctrl+C</kbd> (Windows) for 500ms, then click any element!
      </div>
    </header>

    <TodoStats :todos="todos" />

    <form @submit.prevent="addTodo" :style="formStyle">
      <div :style="inputGroupStyle">
        <input
          type="text"
          v-model="newTodo"
          placeholder="Add a new todo..."
          :style="inputStyle"
        />
        <select v-model="newTodoPriority" :style="prioritySelectStyle">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      <button type="submit" :style="buttonStyle">Add Todo</button>
    </form>

    <TodoFilter v-model:filter="currentFilter" v-model:sortBy="currentSort" />

    <div v-if="filteredTodos.length > 0">
      <ul :style="listStyle">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @updatePriority="updatePriority"
        />
      </ul>
    </div>

    <p v-else :style="emptyStyle">
      {{ emptyMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TodoItem from "./components/TodoItem.vue";
import TodoStats from "./components/TodoStats.vue";
import TodoFilter from "./components/TodoFilter.vue";

const todos = ref([
  {
    id: 1,
    text: "Build an awesome Vue app",
    completed: false,
    priority: "high",
  },
  {
    id: 2,
    text: "Test vue-grab integration",
    completed: false,
    priority: "high",
  },
  {
    id: 3,
    text: "Write some documentation",
    completed: true,
    priority: "medium",
  },
  { id: 4, text: "Deploy to production", completed: false, priority: "medium" },
  { id: 5, text: "Celebrate success 🎉", completed: false, priority: "low" },
  { id: 6, text: "Review pull requests", completed: false, priority: "high" },
  { id: 7, text: "Update dependencies", completed: true, priority: "low" },
  { id: 8, text: "Fix critical bug", completed: false, priority: "high" },
]);

const newTodo = ref("");
const newTodoPriority = ref("medium");
const currentFilter = ref("all");
const currentSort = ref("date");

const addTodo = () => {
  if (!newTodo.value.trim()) return;

  todos.value.push({
    id: Date.now(),
    text: newTodo.value,
    completed: false,
    priority: newTodoPriority.value,
  });
  newTodo.value = "";
  newTodoPriority.value = "medium";
};

const toggleTodo = (id) => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const updatePriority = (id, priority) => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.priority = priority;
  }
};

const filteredTodos = computed(() => {
  let filtered = todos.value;

  if (currentFilter.value === "active") {
    filtered = filtered.filter((t) => !t.completed);
  } else if (currentFilter.value === "completed") {
    filtered = filtered.filter((t) => t.completed);
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  if (currentSort.value === "priority") {
    filtered = [...filtered].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );
  } else if (currentSort.value === "alphabetical") {
    filtered = [...filtered].sort((a, b) => a.text.localeCompare(b.text));
  }

  return filtered;
});

const emptyMessage = computed(() => {
  if (currentFilter.value === "active") {
    return "No active todos! 🎉";
  } else if (currentFilter.value === "completed") {
    return "No completed todos yet.";
  }
  return "No todos yet. Add one above!";
});

const containerStyle = {
  fontFamily: "ui-sans-serif, system-ui, -apple-system",
  maxWidth: "800px",
  margin: "0 auto",
  padding: "2rem",
  backgroundColor: "#f3f4f6",
  minHeight: "100vh",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "2rem",
};

const titleStyle = {
  fontSize: "2.5rem",
  marginBottom: "0.5rem",
  color: "#111827",
};

const subtitleStyle = {
  color: "#6b7280",
  marginBottom: "1rem",
  fontSize: "1.125rem",
};

const instructionsStyle = {
  display: "inline-block",
  padding: "0.75rem 1.5rem",
  backgroundColor: "#3b82f6",
  color: "white",
  borderRadius: "8px",
  fontSize: "0.875rem",
  marginTop: "0.5rem",
};

const formStyle = {
  marginBottom: "1.5rem",
};

const inputGroupStyle = {
  display: "flex",
  gap: "0.5rem",
  marginBottom: "0.5rem",
};

const inputStyle = {
  flex: 1,
  padding: "0.75rem",
  fontSize: "1rem",
  border: "2px solid #e5e7eb",
  borderRadius: "8px",
  boxSizing: "border-box",
};

const prioritySelectStyle = {
  padding: "0.75rem",
  fontSize: "1rem",
  border: "2px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "white",
  cursor: "pointer",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  width: "100%",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
};

const emptyStyle = {
  textAlign: "center",
  color: "#9ca3af",
  marginTop: "2rem",
  fontSize: "1.125rem",
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  background-color: #f3f4f6;
}

kbd {
  background-color: #1f2937;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.2s;
}

button:active {
  transform: translateY(0);
}
</style>
