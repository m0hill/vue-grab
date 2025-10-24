<template>
  <div class="form-composition">
    <h2>User Form (Composition API)</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="Enter your name"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="your@email.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="role">Role:</label>
        <select id="role" v-model="formData.role">
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div class="form-group checkbox">
        <input id="subscribe" v-model="formData.subscribe" type="checkbox" />
        <label for="subscribe">Subscribe to newsletter</label>
      </div>

      <button type="submit">Submit</button>
    </form>

    <div v-if="submitted" class="result">
      <h3>Submitted Data:</h3>
      <pre>{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "FormComposition",
  setup() {
    const formData = reactive({
      name: "",
      email: "",
      role: "developer",
      subscribe: false,
    });

    const submitted = ref(false);
    const lastSubmission = ref(null);

    const handleSubmit = () => {
      lastSubmission.value = { ...formData };
      submitted.value = true;

      setTimeout(() => {
        submitted.value = false;
      }, 5000);
    };

    return {
      formData,
      submitted,
      lastSubmission,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.form-composition {
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group.checkbox label {
  margin-bottom: 0;
}

input[type="text"],
input[type="email"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

button[type="submit"] {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

button[type="submit"]:hover {
  background: #2563eb;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.result h3 {
  margin-top: 0;
  color: #3b82f6;
}

pre {
  background: #f3f4f6;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
}
</style>
