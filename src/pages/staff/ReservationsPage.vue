<script setup lang="ts">
import { ref } from "vue";
import { api } from "../../../lib/client";
import Layout from "../../layouts/staff.vue";
import type { ApiResponse } from "../../../lib/types";

const reservationsRef = ref();
api.get("/reservation").then((response) => {
  reservationsRef.value = response.data as ApiResponse<any>;
});
console.log(reservationsRef.value);
</script>
<template>
  <div class="__main">
    <Layout
      ><h1>Reservations</h1>
      <hr />
      <div v-for="res in reservationsRef">
        {{ res }}
      </div>
    </Layout>
  </div>
</template>
<style scoped>
.__main {
  height: 100%;
}
</style>
