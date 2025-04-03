<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div class="__main-view">
    <Sidebar />
    <div class="__subview">
      <slot />
    </div>
  </div>
</template>
<style scoped>
.__main-view {
  display: grid;
  grid-template-columns: 250px 1fr;
  .__subview {
    border: 4px solid #0001;
    padding: 2rem;
  }
  height: 100%;
}
</style>
