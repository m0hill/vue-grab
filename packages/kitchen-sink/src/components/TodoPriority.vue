<template>
  <div :style="containerStyle">
    <select
      :value="priority"
      @change="$emit('change', $event.target.value)"
      :style="selectStyle"
      :class="`priority-${priority}`"
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <span :style="getBadgeStyle(priority)">
      {{ getPriorityEmoji(priority) }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  priority: {
    type: String,
    default: "medium",
    validator: (value) => ["low", "medium", "high"].includes(value),
  },
});

defineEmits(["change"]);

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
};

const selectStyle = {
  padding: "0.25rem 0.5rem",
  fontSize: "0.75rem",
  border: "1px solid #e5e7eb",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "white",
};

const getBadgeStyle = (priority) => {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  return {
    display: "inline-block",
    width: "1.5rem",
    height: "1.5rem",
    lineHeight: "1.5rem",
    textAlign: "center",
    borderRadius: "50%",
    backgroundColor: colors[priority],
    fontSize: "0.75rem",
  };
};

const getPriorityEmoji = (priority) => {
  const emojis = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  };
  return emojis[priority];
};
</script>

<style scoped>
.priority-low {
  border-color: #10b981;
}

.priority-medium {
  border-color: #f59e0b;
}

.priority-high {
  border-color: #ef4444;
}
</style>
