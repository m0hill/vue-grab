<template>
  <li :style="listItemStyle" :class="{ completed: todo.completed }">
    <div :style="checkboxContainerStyle">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo.id)"
        :style="checkboxStyle"
      />
      <label :style="getTodoTextStyle(todo.completed)">
        {{ todo.text }}
      </label>
    </div>

    <div :style="actionsStyle">
      <TodoPriority
        :priority="todo.priority || 'medium'"
        @change="$emit('updatePriority', todo.id, $event)"
      />
      <button
        @click="$emit('delete', todo.id)"
        :style="deleteButtonStyle"
        class="delete-btn"
      >
        Delete
      </button>
    </div>
  </li>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import TodoPriority from "./TodoPriority.vue";

defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

defineEmits(["toggle", "delete", "updatePriority"]);

const listItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem",
  marginBottom: "0.5rem",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  transition: "all 0.2s",
};

const checkboxContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flex: 1,
};

const checkboxStyle = {
  width: "1.25rem",
  height: "1.25rem",
  cursor: "pointer",
};

const actionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const deleteButtonStyle = {
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const getTodoTextStyle = (completed) => ({
  flex: 1,
  textDecoration: completed ? "line-through" : "none",
  color: completed ? "#9ca3af" : "#111827",
  fontSize: "1rem",
});
</script>

<style scoped>
.completed {
  opacity: 0.7;
}

.delete-btn:hover {
  background-color: #dc2626;
}

li:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}
</style>
