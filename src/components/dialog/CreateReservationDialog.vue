<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { api } from "../../../lib/client";
import type {
  CreateReservationParams,
  PetData,
  UserData,
  ApiResponse,
  TimeSlot,
} from "../../../lib/types";
import { toReservationDate } from "../../../lib/types";
import { AvailableTimeSlots } from "../../constants";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
  handleSubmit: (data: CreateReservationParams) => void;
  handleCancel: () => void;
}>();
const selectedTime = ref<{ from: string; to: string }>();

const slots = AvailableTimeSlots as TimeSlot[];
const slotsRef = ref<TimeSlot[]>(slots);
// Form data
const userInfo = ref({
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
});

const petInfo = ref({
  name: "",
  specie: "",
});

const reservationInfo = ref({
  date: new Date(),
  time: {
    from: "",
    to: "",
  },
});

// Replace toggle boolean refs with string option refs
const userCreationMode = ref<"new" | "existing">("new"); // options: 'new' or 'existing'
const petCreationMode = ref<"new" | "existing">("new"); // options: 'new' or 'existing'

// For existing selection
const useExistingUser = ref(false);
const useExistingPet = ref(false);

// Available data from API
const existingUsers = ref<UserData[]>([]);
const existingPets = ref<PetData[]>([]);
const selectedUser = ref<UserData | null>(null);
const selectedPet = ref<PetData | null>(null);

// Search filters
const userSearchTerm = ref("");
const petSearchTerm = ref("");

// Filtered lists based on search
const filteredUsers = ref<UserData[]>([]);
const filteredPets = ref<PetData[]>([]);

// Loading states
const loadingUsers = ref(false);
const loadingPets = ref(false);

// Fetch users from API
const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const response = await api.get("/user");
    const data = response.data as ApiResponse<UserData[]>;
    if (!data.error && data.data) {
      //existingUsers.value = data.data.filter((user) => user.type === "client");
      existingUsers.value = data.data.filter((user) => user.type);
      filteredUsers.value = [...existingUsers.value];
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loadingUsers.value = false;
  }
};

// Fetch pets from API
const fetchPets = async () => {
  loadingPets.value = true;
  try {
    const response = await api.get("/pet");
    const data = response.data as ApiResponse<PetData[]>;
    if (!data.error && data.data) {
      existingPets.value = data.data;
      filteredPets.value = [...existingPets.value];
    }
  } catch (error) {
    console.error("Failed to fetch pets:", error);
  } finally {
    loadingPets.value = false;
  }
};

// Filter users based on search term
const filterUsers = () => {
  if (!userSearchTerm.value) {
    filteredUsers.value = [...existingUsers.value];
    return;
  }

  const term = userSearchTerm.value.toLowerCase();
  filteredUsers.value = existingUsers.value.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.surname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phoneNumber.toLowerCase().includes(term),
  );
};

// Filter pets based on search term
const filterPets = () => {
  if (!petSearchTerm.value) {
    filteredPets.value = [...existingPets.value];
    return;
  }

  const term = petSearchTerm.value.toLowerCase();
  filteredPets.value = existingPets.value.filter(
    (pet) =>
      pet.name.toLowerCase().includes(term) ||
      pet.specie.toLowerCase().includes(term),
  );
};

// Watch for changes in search terms
watch(userSearchTerm, filterUsers);
watch(petSearchTerm, filterPets);

// Load pets for selected user
const loadUserPets = () => {
  if (selectedUser.value) {
    filteredPets.value = existingPets.value.filter(
      (pet) => pet.ownerId === selectedUser.value?.id,
    );
  } else {
    filteredPets.value = [...existingPets.value];
  }
};

watch(selectedUser, loadUserPets);

// Handle user selection
const onUserSelect = (user: UserData) => {
  selectedUser.value = user;
  userInfo.value = {
    name: user.name,
    surname: user.surname,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };
};

// Handle pet selection
const onPetSelect = (pet: PetData) => {
  selectedPet.value = pet;
  petInfo.value = {
    name: pet.name,
    specie: pet.specie,
  };
};

// Handle form submission
const onSubmit = () => {
  if (!selectedTime.value) {
    toast.add({
      severity: "error",
      summary: "Info required",
      detail: "Reservation TIme not specified",
    });
    return;
  }
  const formData: CreateReservationParams = {
    userInfo:
      useExistingUser.value && selectedUser.value
        ? { id: selectedUser.value.id }
        : userInfo.value,
    petInfo:
      useExistingPet.value && selectedPet.value
        ? { id: selectedPet.value.id }
        : petInfo.value,
    reservationInfo: {
      date: toReservationDate(reservationInfo.value.date),
      time: selectedTime.value,
    },
  };

  props.handleSubmit(formData);
};

onMounted(() => {
  fetchUsers();
  fetchPets();
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="p-fluid">
    <!-- User Information Section -->
    <Fieldset legend="User Information">
      <div class="mb-3">
        <SelectButton
          v-model="userCreationMode"
          :options="[
            { label: 'Create New User', value: 'new', icon: 'pi pi-plus' },
            {
              label: 'Use Existing User',
              value: 'existing',
              icon: 'pi pi-user',
            },
          ]"
          :allow-empty="false"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div v-if="userCreationMode == 'existing'">
        <div class="field mb-4">
          <label for="userSearch">Search Users</label>
          <div class="p-inputgroup w-full">
            <InputText
              id="userSearch"
              v-model="userSearchTerm"
              placeholder="Search by name, email or phone"
              :loading="loadingUsers"
            />
            <Button
              icon="pi pi-search"
              class="p-button-secondary"
              @click="filterUsers"
            />
          </div>
        </div>

        <div class="field">
          <label for="userSelect">Select User</label>
          <Select
            id="userSelect"
            v-model="selectedUser"
            :options="filteredUsers"
            optionLabel="name"
            placeholder="Select a user"
            class="w-full"
            :loading="loadingUsers"
            :filter="true"
            filterPlaceholder="Search users"
            @change="(ev) => onUserSelect(ev.value)"
          >
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>
                  <div>
                    {{ slotProps.option.name }} {{ slotProps.option.surname }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ slotProps.option.email || slotProps.option.phoneNumber }}
                  </div>
                </div>
              </div>
            </template>
            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ slotProps.value.name }} {{ slotProps.value.surname }}
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Select>
        </div>
      </div>
      <div v-else>
        <div class="field">
          <label for="name">First Name</label>
          <InputText id="name" v-model="userInfo.name" required />
        </div>

        <div class="field">
          <label for="surname">Last Name</label>
          <InputText id="surname" v-model="userInfo.surname" required />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model="userInfo.email" type="email" />
        </div>

        <div class="field">
          <label for="phoneNumber">Phone Number</label>
          <InputText id="phoneNumber" v-model="userInfo.phoneNumber" />
        </div>
      </div>
    </Fieldset>

    <!-- Pet Information Section -->
    <Fieldset legend="Pet Information" class="mt-4">
      <div class="mb-3">
        <SelectButton
          v-model="petCreationMode"
          :options="[
            { label: 'Create New Pet', value: 'new', icon: 'pi pi-plus' },
            {
              label: 'Use Existing Pet',
              value: 'existing',
              icon: 'pi pi-heart',
            },
          ]"
          :allow-empty="false"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div v-if="petCreationMode == 'existing'">
        <div class="field mb-4">
          <label for="petSearch">Search Pets</label>
          <div class="p-inputgroup w-full">
            <InputText
              id="petSearch"
              v-model="petSearchTerm"
              placeholder="Search by name or species"
              :loading="loadingPets"
              class="w-300px"
            />
            <Button
              icon="pi pi-search"
              class="p-button-secondary"
              @click="filterPets"
            />
          </div>
        </div>

        <div class="field">
          <label for="petSelect">Select Pet</label>
          <Select
            id="petSelect"
            v-model="selectedPet"
            :options="filteredPets"
            optionLabel="name"
            placeholder="Select a pet"
            class="w-full"
            :loading="loadingPets"
            :filter="true"
            filterPlaceholder="Search pets"
            @change="(ev) => onPetSelect(ev.value)"
          >
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>
                  <div>{{ slotProps.option.name }}</div>
                  <div class="text-sm text-gray-500">
                    Species: {{ slotProps.option.specie }}
                  </div>
                </div>
              </div>
            </template>
            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ slotProps.value.name }} ({{ slotProps.value.specie }})
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </Select>
        </div>
      </div>

      <div v-else>
        <div class="field">
          <label for="petName">Pet Name</label>
          <InputText id="petName" v-model="petInfo.name" required />
        </div>

        <div class="field">
          <label for="specie">Species</label>
          <InputText id="specie" v-model="petInfo.specie" required />
        </div>
      </div>
    </Fieldset>

    <!-- Reservation Information Section -->
    <Fieldset legend="Reservation Details" class="mt-4">
      <div class="field">
        <label for="date">Date</label>
        <Calendar
          id="date"
          v-model="reservationInfo.date"
          dateFormat="dd/mm/yy"
          required
        />
      </div>

      <div class="pad-5 column">
        <label class="pad-5" for="selectedTime">Time</label>
        <!-- <div class="row"> -->
        <Select
          :options="slotsRef"
          class="w-300px"
          id="selectedTime"
          name="selectedTime"
          placeholder="Select a time slot"
          v-model="selectedTime"
          required
          ><template #value="slotProps">
            <div v-if="slotProps.value" class="flex">
              <div>{{ slotProps.value.from }} - {{ slotProps.value.to }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex">
              <div>{{ slotProps.option.from }} - {{ slotProps.option.to }}</div>
            </div>
          </template>
        </Select>
      </div>
    </Fieldset>

    <!-- Submit Buttons -->
    <div class="flex justify-content-end gap-2 mt-4">
      <Button
        type="button"
        label="Cancel"
        class="p-button-secondary"
        @click="handleCancel"
      />
      <Button type="submit" label="Create Reservation" />
    </div>
  </form>
</template>
