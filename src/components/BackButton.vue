<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goBackButtonClick = (ev: MouseEvent) => {
  ev.preventDefault();
  router.go(-1);
};
</script>
<template>
  <div class="back-button" variant="link">
    <Button
      @click="goBackButtonClick"
      label="Go back"
      variant="link"
      icon="pi pi-arrow-left"
      rounded
    />
  </div>
</template>
<style scoped>
.back-button {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 1024;
}
</style>
