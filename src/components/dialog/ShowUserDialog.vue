<script lang="ts" setup>
import { computed } from "vue";
import type { StaffUserData, UserData } from "../../models/user";

const props = defineProps<{
  item: UserData | StaffUserData;
}>();

const isStaffUser = computed(() => "role" in props.item);
</script>

<template>
  <div class="column justify-center gap-4">
    <Fieldset legend="User Information" class="-100p">
      <div class="flex column gap-2">
        <div class="row">
          <strong class="w-200px">Name:</strong>
          <span>{{ item.name }} {{ item.surname }}</span>
        </div>
        <div class="row">
          <strong class="w-200px">Email:</strong>
          <span>{{ item.email }}</span>
        </div>
        <div class="row">
          <strong class="w-200px">Phone:</strong>
          <span>{{ item.phoneNumber }}</span>
        </div>
        <div v-if="isStaffUser" class="row">
          <strong class="w-200px">Role:</strong>
          <span>{{ (item as StaffUserData).role }}</span>
        </div>
        <div class="row">
          <strong class="w-200px">Account Created:</strong>
          <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
        </div>
      </div>
    </Fieldset>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
</style>
