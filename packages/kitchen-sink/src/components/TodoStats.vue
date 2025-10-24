<template>
  <div :style="containerStyle">
    <div :style="cardStyle">
      <div :style="iconStyle">✅</div>
      <div>
        <div :style="labelStyle">Completed</div>
        <div :style="valueStyle">{{ completedCount }}</div>
      </div>
    </div>

    <div :style="cardStyle">
      <div :style="iconStyle">⏳</div>
      <div>
        <div :style="labelStyle">Pending</div>
        <div :style="valueStyle">{{ pendingCount }}</div>
      </div>
    </div>

    <div :style="cardStyle">
      <div :style="iconStyle">📊</div>
      <div>
        <div :style="labelStyle">Progress</div>
        <div :style="valueStyle">{{ progressPercentage }}%</div>
      </div>
    </div>

    <div :style="cardStyle">
      <div :style="iconStyle">🔴</div>
      <div>
        <div :style="labelStyle">High Priority</div>
        <div :style="valueStyle">{{ highPriorityCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  todos: {
    type: Array,
    required: true,
  },
});

const completedCount = computed(
  () => props.todos.filter((t) => t.completed).length,
);

const pendingCount = computed(
  () => props.todos.filter((t) => !t.completed).length,
);

const progressPercentage = computed(() =>
  props.todos.length === 0
    ? 0
    : Math.round((completedCount.value / props.todos.length) * 100),
);

const highPriorityCount = computed(
  () => props.todos.filter((t) => t.priority === "high" && !t.completed).length,
);

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1rem",
  marginBottom: "2rem",
};

const cardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1rem",
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const iconStyle = {
  fontSize: "2rem",
};

const labelStyle = {
  fontSize: "0.75rem",
  color: "#6b7280",
  marginBottom: "0.25rem",
};

const valueStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#111827",
};
</script>
