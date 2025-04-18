<script setup lang="ts">
import { computed } from "vue";
import type { StaffUserData, UserData } from "../../lib/types";

const props = defineProps<{
  item: UserData | StaffUserData;
}>();

const emit = defineEmits(["view", "edit"]);

const isStaffUser = computed(() => "role" in props.item);

const handleView = () => {
  emit("view", props.item);
};

const handleEdit = () => {
  emit("edit", props.item);
};
</script>

<template>
  <div>
    <div class="row">
      <div class="row flex-grow-1">
        <div class="column w-100px">
          <Badge :value="item.type" severity="contrast" />
        </div>
        <div class="column gap-10px">
          <div class="row">
            <div class="col"><strong>Name :</strong> {{ item.name }}</div>
            <div v-if="item.surname && item.surname != ''" class="col">
              <strong>Surname:</strong> {{ item.surname }}
            </div>
          </div>
          <div class="row">
            <div v-if="item.phoneNumber" class="col">
              <strong>Phone Number : </strong> {{ item.phoneNumber }}
            </div>
            <div v-if="item.email" class="col">
              <strong>Email : </strong> {{ item.email }}
            </div>
          </div>
          <div v-if="isStaffUser" class="row">
            <strong>Role:</strong> {{ (item as StaffUserData).role }}
          </div>
        </div>
      </div>
      <div class="row">
        <Button icon="pi pi-eye" text @click="handleView" />
        <Button icon="pi pi-pencil" text @click="handleEdit" />
      </div>
    </div>
    <Divider />
  </div>
</template>
