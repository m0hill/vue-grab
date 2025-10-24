<template>
  <div :style="containerStyle">
    <div :style="filterGroupStyle">
      <label :style="labelStyle">Filter:</label>
      <button
        v-for="option in filterOptions"
        :key="option.value"
        @click="$emit('update:filter', option.value)"
        :style="getButtonStyle(option.value)"
        :class="{ active: filter === option.value }"
      >
        {{ option.label }}
      </button>
    </div>

    <div :style="sortGroupStyle">
      <label :style="labelStyle">Sort:</label>
      <select
        :value="sortBy"
        @change="$emit('update:sortBy', $event.target.value)"
        :style="selectStyle"
      >
        <option value="date">Date Added</option>
        <option value="priority">Priority</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  filter: {
    type: String,
    default: "all",
  },
  sortBy: {
    type: String,
    default: "date",
  },
});

defineEmits(["update:filter", "update:sortBy"]);

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
  gap: "1rem",
};

const filterGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const sortGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const labelStyle = {
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
};

const getButtonStyle = (value) => ({
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  backgroundColor: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s",
});

const selectStyle = {
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  backgroundColor: "white",
  cursor: "pointer",
};
</script>

<style scoped>
button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
