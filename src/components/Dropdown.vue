<script setup lang="ts">
const props = defineProps<{
  isShown: boolean;
}>();
//const isShown = ref(false);
</script>
<template>
  <div class="dropdown" :class="props.isShown ? 'is-shown' : ''">
    <slot />
  </div>
</template>
<style scoped>
.dropdown {
  &:not(.is-shown) {
    display: none;
  }
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #fed;
  border: 1px solid #0003;
}
</style>
