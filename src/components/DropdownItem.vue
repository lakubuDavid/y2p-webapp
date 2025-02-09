<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>
<template>
  <div @click="() => emit('click')" class="dropdown-item">
    <slot />
  </div>
</template>
<style scoped>
.dropdown-item {
  -webkit-text-stroke: 0.5px;
  cursor: pointer;
}
</style>
