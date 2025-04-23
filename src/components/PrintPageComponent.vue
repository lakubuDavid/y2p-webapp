<template>
  <div class="print-page">
    <div class="print-header">
      <slot name="header">
        <h1>{{ title }}</h1>
        <div class="print-date">{{ formattedDate }}</div>
      </slot>
    </div>

    <div class="print-content">
      <h1>T</h1>
      <slot></slot>
    </div>

    <div class="print-footer">
      <slot name="footer">
        <div class="print-info">{{ footerText }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

defineProps({
  title: {
    type: String,
    default: "Document",
  },
  footerText: {
    type: String,
    default: "© Company Name",
  },
});

const totalPages = ref(1);
const formattedDate = ref("");

onMounted(() => {
  // Set the current date
  const now = new Date();
  formattedDate.value = now.toLocaleDateString();

  // In a real implementation you might use a library to detect pages
  // This is simplified for demonstration purposes
  totalPages.value = 1;
});
</script>

<style scoped>
.print-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #fff;
}

.print-header {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.print-content {
  flex: 1;
  padding: 20px 0;
}

.print-footer {
  padding: 10px 0;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
}

/* Print specific styles */
@media print {
  .print-page {
    height: 100%;
    width: 100%;
  }

  .print-header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: white;
  }

  .print-content {
    margin-top: 60px;
    margin-bottom: 40px;
  }

  .print-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
  }

  /* Hide elements that shouldn't be printed */
  .no-print {
    display: none !important;
  }
}
</style>
