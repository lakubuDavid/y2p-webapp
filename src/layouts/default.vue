<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
import UserBadge from "../components/UserBadge.vue";
</script>
<template>
  <div>
    <NavBar />
    <UserBadge />
    <slot />
    <Footer />
  </div>
</template>
