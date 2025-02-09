<script setup lang="ts">
import Layout from "../layouts/accessform.vue";
</script>
<template>
  <Layout name="Reservation Status">
    <div>
      <form>
        <div class="form-group">
          <label for="i-reservation-number"> Reservation number </label>
          <input
            type="text"
            name="i-reservation-number"
            id="i-reservation-number"
          />
        </div>
        <div class="form-group">
          <label for="i-password"> Code </label>
          <input type="password" name="i-password" id="i-password" />
        </div>
      </form>
    </div>
  </Layout>
</template>
