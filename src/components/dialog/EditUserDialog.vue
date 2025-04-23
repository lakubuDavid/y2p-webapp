<script lang="ts" setup>
import { ref } from "vue";
import type { ApiResponse } from "../../../lib/types";
import type { UserData, StaffUserData } from "../../models/user";
import { useToast } from "primevue/usetoast";
import { api } from "../../../lib/client";
import { useUserStore } from "@stores/user";
import { useConfirm } from "primevue/useconfirm";
import { capitalized } from "@lib/utils";

const props = defineProps<{
  item: UserData | StaffUserData;
  handleSubmit: (values: Partial<UserData>) => Promise<any>;
}>();

const toast = useToast();
const confirm = useConfirm();

const userTypeOptions = ["client", "staff"];
const staffRoles = ["receptionist", "admin", "veterinary"];

const selectedStaffRole = ref<"receptionist" | "admin" | "veterinary">(
  (props.item as StaffUserData).role,
);
const selectedUserType = ref<"client" | "staff" | "anonymous">(props.item.type);

const store = useUserStore();

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
const generating = ref(false);

const onSubmit = async () => {
  const updateData: Partial<UserData | StaffUserData> = {
    name: userInfo.value.name,
    surname: userInfo.value.surname,
    email: userInfo.value.email,
    phoneNumber: userInfo.value.phoneNumber,
    type: selectedUserType.value,
    role: selectedStaffRole.value,
  };

  if (isStaffUser.value && selectedRole.value) {
    (updateData as Partial<StaffUserData>).role = selectedRole.value;
  }

  await store.update(props.item.id, updateData);
  if (store.error) {
    toast.add({
      severity: "error",
      summary: "Update Error !",
      detail: store.error.message,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Update Done !",
    });
    store.refresh();
  }
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

const deleteUser = () => {
  confirm.require({
    modal: true,
    message: "Do you want to delete this record?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      store.delete(props.item.id).then(() => {
        toast.add({ severity: "success", summary: "Record deleted" });
      });
    },
  });
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
        @click="deleteUser()"
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
