<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import type { UserData } from "../../models/user";
import { useAccountsStore } from "@stores/accounts";
import { usePetsStore } from "@stores/pets";

// Props definition
const props = defineProps<{
  close?: () => void;
}>();

// Toast notification
const toast = useToast();
const accountsStore = useAccountsStore();
const store = usePetsStore();

// User selection
const existingUsers = ref<UserData[]>([]);
const selectedOwner = ref<UserData | null>(null);
const filteredUsers = ref<UserData[]>([]);
const userSearchQuery = ref("");

// Form data
const form = ref({
  name: "",
  metadata: {},
});

// Species options
const specieOptions = [
  { label: "Cat", value: "cat" },
  { label: "Dog", value: "dog" },
  { label: "Bird", value: "bird" },
  { label: "Other", value: "other" },
];
const selectedSpecie = ref("");
const otherSpecie = ref("");

// UI state
const errors = ref<string[]>([]);
const creating = ref(false);

// Computed effective species
const effectiveSpecie = computed(() => {
  return selectedSpecie.value === "other"
    ? otherSpecie.value
    : selectedSpecie.value;
});

// Fetch users on component mount
onMounted(async () => {
  try {
    await accountsStore.refresh();
    existingUsers.value = accountsStore.accounts ?? [];
    filteredUsers.value = existingUsers.value;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load users",
      life: 3000,
    });
  }
});

// Filter users based on search query
const searchUsers = () => {
  if (!userSearchQuery.value.trim()) {
    filteredUsers.value = existingUsers.value;
    return;
  }

  const query = userSearchQuery.value.toLowerCase();
  filteredUsers.value = existingUsers.value.filter(
    (user) =>
      user.name?.toLowerCase().includes(query) ||
      user.surname?.toLowerCase().includes(query) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.phoneNumber && user.phoneNumber.includes(query)),
  );
};

// Clear search results
const clearSearch = () => {
  userSearchQuery.value = "";
  filteredUsers.value = existingUsers.value;
};

// Form validation
const validateForm = () => {
  errors.value = [];

  if (!selectedOwner.value) {
    errors.value.push("Please select a pet owner");
  }

  if (!form.value.name.trim()) {
    errors.value.push("Pet name is required");
  }

  if (!selectedSpecie.value) {
    errors.value.push("Please select a pet species");
  } else if (selectedSpecie.value === "Other" && !otherSpecie.value.trim()) {
    errors.value.push("Please specify the pet species");
  }

  return errors.value.length === 0;
};

// Handle form submission
const onSubmit = async () => {
  if (!validateForm()) return;

  creating.value = true;
  try {
    await store.create({
      name: form.value.name,
      specie: effectiveSpecie.value,
      metadata: form.value.metadata,
      ownerId: selectedOwner.value?.id!,
    });

    // Reset form after successful submission
    form.value = {
      name: "",
      metadata: {},
    };
    selectedSpecie.value = "";
    otherSpecie.value = "";
    selectedOwner.value = null;
    userSearchQuery.value = "";

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Pet created successfully",
      life: 3000,
    });

    if (props.close) {
      props.close();
    }
  } catch (error) {
    console.error("Error creating pet:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create pet",
      life: 3000,
    });
  } finally {
    creating.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="p-fluid">
    <Message v-if="errors.length > 0" severity="error">
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </Message>

    <!-- Owner Selection Section -->
    <Fieldset legend="Owner Information">
      <div class="mb-3">
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">
            <i class="pi pi-search"></i>
          </span>
          <InputText
            v-model="userSearchQuery"
            placeholder="Search for users by name, email, or phone"
            @input="searchUsers"
          />
          <Button
            type="button"
            icon="pi pi-times"
            class="p-button-secondary"
            @click="clearSearch"
            v-if="userSearchQuery"
          />
        </div>

        <small
          class="p-error"
          v-if="errors.includes('Please select a pet owner')"
        >
          Please select a pet owner
        </small>
      </div>

      <DataTable
        :value="filteredUsers"
        v-model:selection="selectedOwner"
        selectionMode="single"
        dataKey="id"
        :paginator="filteredUsers.length > 5"
        :rows="5"
        stripedRows
        :rowHover="true"
        responsiveLayout="scroll"
        class="mb-3"
      >
        <Column selectionMode="single" style="width: 3rem" />
        <Column field="name" header="First Name"></Column>
        <Column field="surname" header="Last Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="phoneNumber" header="Phone"></Column>
      </DataTable>

      <div v-if="selectedOwner" class="p-3 surface-100 border-round">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-xl"></i>
          <span class="font-bold">
            {{ selectedOwner.name }} {{ selectedOwner.surname }}
          </span>
          <span v-if="selectedOwner.email" class="text-sm text-500 ml-2">
            ({{ selectedOwner.email }})
          </span>
        </div>
      </div>
    </Fieldset>

    <!-- Pet Information Section -->
    <Fieldset legend="Pet Information" class="mt-3">
      <div class="field">
        <label for="petName">Pet Name</label>
        <InputText
          id="petName"
          v-model="form.name"
          placeholder="Enter pet name"
          :class="{ 'p-invalid': errors.includes('Pet name is required') }"
        />
        <small class="p-error" v-if="errors.includes('Pet name is required')">
          Pet name is required
        </small>
      </div>

      <div class="field column gap-15px">
        <label for="petSpecie">Species</label>
        <Select
          id="petSpecie"
          v-model="selectedSpecie"
          :options="specieOptions"
          option-label="label"
          option-value="value"
          placeholder="Select a species"
          :class="{
            'p-invalid': errors.includes('Please select a pet species'),
          }"
          class="w-200px"
        />
        <small
          class="p-error"
          v-if="errors.includes('Please select a pet species')"
        >
          Please select a pet species
        </small>
      </div>

      <div class="field" v-if="selectedSpecie === 'other'">
        <label for="otherSpecie">Specify Species</label>
        <InputText
          id="otherSpecie"
          v-model="otherSpecie"
          placeholder="Enter species name"
          :class="{
            'p-invalid': errors.includes('Please specify the pet species'),
          }"
        />
        <small
          class="p-error"
          v-if="errors.includes('Please specify the pet species')"
        >
          Please specify the pet species
        </small>
      </div>

      <!-- Additional Information with Metadata Editor -->
      <MetadataEditor v-model="form.metadata" />
    </Fieldset>

    <!-- Action Buttons -->
    <div class="flex justify-content-end gap-2 mt-4">
      <Button
        label="Cancel"
        icon="pi pi-times"
        type="button"
        class="p-button-secondary p-button-outlined"
        @click="props.close"
        v-if="props.close"
      />
      <Button
        label="Create Pet"
        icon="pi pi-check"
        type="submit"
        :loading="creating"
      />
    </div>
  </form>
</template>
