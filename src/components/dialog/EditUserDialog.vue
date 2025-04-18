<script lang="ts" setup>
import { ref } from "vue";
import type { UserData, StaffUserData, ApiResponse } from "../../../lib/types";
import { useToast } from "primevue/usetoast";
import { api } from "../../../lib/client";

const toast = useToast();

const props = defineProps<{
  item: UserData | StaffUserData;
  handleSubmit: (values: Partial<UserData>) => Promise<any>;
}>();

const userInfo = ref({
  name: props.item.name || "",
  surname: props.item.surname || "",
  email: props.item.email || "",
  phoneNumber: props.item.phoneNumber || "",
});

const isStaffUser = ref("role" in props.item);
const selectedRole = ref(
  isStaffUser.value ? (props.item as StaffUserData).role : null,
);
const staffRoles = ["receptionist", "admin", "veterinary"];
const generating = ref(false);

const onSubmit = async () => {
  const updateData: Partial<UserData | StaffUserData> = {
    name: userInfo.value.name,
    surname: userInfo.value.surname,
    email: userInfo.value.email,
    phoneNumber: userInfo.value.phoneNumber,
  };

  if (isStaffUser.value && selectedRole.value) {
    (updateData as Partial<StaffUserData>).role = selectedRole.value;
  }

  await props.handleSubmit(updateData);
};

const generateMagicLink = async () => {
  generating.value = true;
  try {
    const response = await api.post(`/auth/magic-link`, {
      userId: props.item.id,
    });

    if (response.ok) {
      toast.add({
        severity: "success",
        summary: "Magic Link Created",
        detail: "A password reset link has been sent to the user's email",
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Failed to generate magic link",
        detail:
          (response.data as ApiResponse<any>).error ||
          "An unknown error occurred",
        life: 5000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to generate magic link",
      life: 5000,
    });
    console.error("Error generating magic link:", error);
  } finally {
    generating.value = false;
  }
};
</script>

<template>
  <Form @submit="onSubmit" class="flex column gap-4">
    <Fieldset legend="User Information" class="column gap-15px">
      <div class="row">
        <FloatLabel class="pad-15px" variant="in">
          <label for="name">Name</label>
          <InputText
            id="name"
            v-model="userInfo.name"
            required
            class="w-200px"
          />
        </FloatLabel>
        <FloatLabel class="pad-15px" variant="in">
          <label for="surname">Surname</label>
          <InputText
            id="surname"
            v-model="userInfo.surname"
            required
            class="w-200px"
          />
        </FloatLabel>
      </div>
      <FloatLabel class="pad-15px" variant="in">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="userInfo.email"
          required
          class="w-350px"
          type="email"
        />
      </FloatLabel>
      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <InputText
          id="phoneNumber"
          type="tel"
          v-model="userInfo.phoneNumber"
          class="w-250px"
        />
      </div>
      <div v-if="isStaffUser" class="form-group">
        <label for="role">Staff Role</label>
        <Select
          id="role"
          v-model="selectedRole"
          :options="staffRoles"
          placeholder="Select a role"
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex">
              {{
                slotProps.option.charAt(0).toUpperCase() +
                slotProps.option.slice(1)
              }}
            </div>
          </template>
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex">
              {{
                slotProps.value.charAt(0).toUpperCase() +
                slotProps.value.slice(1)
              }}
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Select>
      </div>
    </Fieldset>

    <div class="flex justify-content-between align-items-center">
      <Button
        type="button"
        label="Reset Password"
        icon="pi pi-key"
        @click="generateMagicLink"
        :loading="generating"
        severity="info"
        class="mr-2"
        text
      />
      <Button
        type="button"
        icon="pi pi-trash"
        severity="danger"
        class="mr-2"
        text
      />
      <Spacer />
      <Button type="submit" label="Save " icon="pi pi-check" class="mr-2" />
      <Button
        type="button"
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
      />
    </div>
  </Form>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
