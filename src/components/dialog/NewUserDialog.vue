<script setup lang="ts">
import type { CreateUserParams } from "@lib/types";
import { capitalized } from "@lib/utils";
import { ref } from "vue";

defineProps<{
  handleSubmit: (data: CreateUserParams) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
}>();

const userInfo = ref({
  name: "",
  surname: "",
  email: "",
});

const selectedUserType = ref<"client" | "staff">();
const selectedStaffRole = ref<"receptionist" | "admin" | "veterinary">();

const userTypeOptions = ["client", "staff"];
const staffRoles = ["receptionist", "admin", "veterinary"];
</script>
<template>
  <Form class="column gap-10">
    <div>
      <FieldSet legend="User Info" class="pad-15">
        <div class="row">
          <FloatLabel class="pad-5" variant="in">
            <InputText
              id="name"
              name="name"
              class="w-150px"
              v-model="userInfo.name"
              required
            />
            <label for="name">Name</label>
          </FloatLabel>
          <FloatLabel class="pad-5" variant="in">
            <InputText
              id="surname"
              name="surname"
              class="w-150px"
              v-model="userInfo.surname"
              required
            />
            <label for="surname">Surname</label>
          </FloatLabel>
        </div>
        <div class="column">
          <FloatLabel class="pad-5" variant="in">
            <label for="email">Email</label>
            <InputText
              name="email"
              id="email"
              class="w-300px"
              v-model="userInfo.email"
            />
          </FloatLabel>
        </div>
      </FieldSet>
      <Fieldset legend="Role & Access" class="pad-15px">
        <div class="column gap-10px">
          <label for="userType">User Type</label>
          <Select
            name="userType"
            id="userType"
            class="w-250px"
            placeholder="Select the user type"
            :options="userTypeOptions"
            v-model="selectedUserType"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex">
                <div>{{ capitalized(slotProps.value) }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>

            <template #option="slotProps">
              <div class="flex">
                {{ capitalized(slotProps.option) }}
              </div>
            </template></Select
          >
          <label
            for="userRole"
            v-if="selectedUserType && selectedUserType == 'staff'"
            >Staff Role</label
          >
          <Select
            name="userRole"
            id="userRole"
            class="w-250px"
            placeholder="Select the staff role"
            :options="staffRoles"
            v-model="selectedStaffRole"
            v-if="selectedUserType && selectedUserType == 'staff'"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex">
                <div>{{ capitalized(slotProps.value) }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>

            <template #option="slotProps">
              <div class="flex">
                {{ capitalized(slotProps.option) }}
              </div>
            </template>
          </Select>
        </div>
      </Fieldset>
    </div>
    <div class="row gap-10">
      <Button label="Submit" type="submit" />
      <Button label="Cancel" @click="handleCancel()" />
    </div>
  </Form>
</template>
<style scoped></style>
