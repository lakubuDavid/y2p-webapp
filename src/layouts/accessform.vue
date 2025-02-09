<script setup lang="ts">
import { useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";
//import { useAppState } from "../composables/appState";

const props = defineProps<{
  name?: string;
}>();
//const { state } = useAppState();
const route = useRoute();
console.log(route.name);
</script>
<template>
  <div>
    <NavBar />
    <div class="__sections">
      <div class="__section-2">
        <slot />
      </div>
      <div class="__section-1" :class="route.name">
        <div>
          <h1>{{ props.name ?? "Access Form" }}</h1>
          <br />
          <RouterLink to="/">go home</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" scoped>
.__sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  > * {
    padding: 4rem;
    place-items: center;
    display: flex;
  }
  .__section-1 {
    &.login {
      background-color: coral;
    }
    &.signup {
      background-color: cornflowerblue;
    }
    &.check_reservation {
      background-color: cadetblue;
    }
    a {
      color: antiquewhite;
    }
    background: gray;
    color: #ffffff;
    font-weight: 600;
    font-size: 2ch;
    border-left: 1px solid #0003;
  }
}
</style>
