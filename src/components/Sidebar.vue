<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";
import { useRouter } from "vue-router";
const router = useRouter();
const menuItems: MenuItem[] = [
  {
    label: "Home",
    command: () => {
      router.push("/");
    },
  },
  { separator: true },
  {
    label: "Accounts",
    command: () => {
      router.push("/staff/account");
    },
  },
  {
    label: "Reservations",
    command: () => {
      router.push("/staff/reservations");
    },
  },
  {
    label: "Pets",
    command: () => {
      router.push("/staff/pets");
    },
  },
  { separator: true },
  { label: "My Account" },
  { label: "Signout" },
];
</script>
<template>
  <div class="__sidebar pad-20">
    <h2><RouterLink to="/">Go home</RouterLink></h2>
    <!-- <div class="__content"> -->
    <!-- <ul> -->
    <!-- <li><RouterLink to="/staff/account">Accounts</RouterLink></li> -->
    <!-- <li><RouterLink to="/staff/reservations">Reservations</RouterLink></li> -->
    <!-- <li><RouterLink to="/staff/pets">Pets</RouterLink></li> -->
    <!-- </ul> -->
    <!-- </div> -->
    <Menu :model="menuItems" />
  </div>
</template>
<style scoped>
.__sidebar {
  border-right: 1px solid #0003;
  height: 100%;
  max-height: 100%;

  .__content {
    padding: 2rem;
    ul {
      list-style: none;
      padding: 0px;
    }
  }
  a {
    color: #321;
  }
}
</style>
