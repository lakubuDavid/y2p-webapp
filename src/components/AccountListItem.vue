<script setup lang="ts">
import type { UserData } from "../../lib/types";

defineProps<{
  item: UserData;
}>();
</script>
<template>
  <div>
    <!-- <Card> -->
    <!-- <template #content> -->
    <div class="row">
      <div class="col"><strong>Name :</strong> {{ item.name }}</div>
      <div v-if="item.surname && item.surname != ''" class="col">
        <strong>Surname:</strong> {{ item.surname }}
      </div>
      <div class="col">
        <Badge :value="item.type" severity="secondary" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <strong>Phone Number : </strong> {{ item.phoneNumber }}
      </div>
      <div class="col"><strong>Email : </strong> {{ item.email }}</div>
    </div>
    <div class="row">
      <Button icon="pi pi-eye" text />
      <Button icon="pi pi-pencil" text />
    </div>
    <Divider />
    <!-- </template> -->
    <!-- </Card> -->
  </div>
</template>
