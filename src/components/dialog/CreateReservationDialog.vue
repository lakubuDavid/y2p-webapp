<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { api } from "../../../lib/client";
import type { ApiResponse, TimeSlot } from "../../../lib/types";
import { toReservationDate } from "../../../lib/types";
import { AvailableTimeSlots } from "../../constants";
import { useToast } from "primevue/usetoast";
import type { CreateReservationParams } from "../../models/reservation";
import type { UserData } from "../../models/user";
import type { PetData } from "../../models/pet";
import { useReservationsStore } from "@stores/reservations";

const toast = useToast();
const store = useReservationsStore();

const props = defineProps<{
  close: () => void;
}>();
const selectedTime = ref<{ from: string; to: string }>();

const slots = AvailableTimeSlots as TimeSlot[];
const availableSlots = ref<TimeSlot[]>(slots);
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
  service: "",
});

const services = [
  { label: "Grooming", value: "grooming" },
  { label: "Consultation", value: "consultation" },
  { label: "Vaccination", value: "vaccination" },
];
const speciesOptions = [
  { label: "Cat", value: "cat" },
  { label: "Dog", value: "dog" },
  { label: "Bird", value: "bird" },
  { label: "Other", value: "other" },
];
const otherSpecie = ref<string>();

const errors = ref<string[]>([]);

// Replace toggle boolean refs with string option refs
const userCreationMode = ref<"new" | "existing">("new"); // options: 'new' or 'existing'
const petCreationMode = ref<"new" | "existing">("new"); // options: 'new' or 'existing'

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

const onDateSelect = async (date: Date) => {
  availableSlots.value = (await store.getAvailableSlots(date)) ?? [];
};

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
  errors.value = [];

  // Input validation
  if (userCreationMode.value == "existing" && !selectedUser.value) {
    errors.value.push("Please select the existing owner");
  } else if (userCreationMode.value == "new") {
    if (!userInfo.value.email && !userInfo.value.phoneNumber) {
      errors.value.push(
        "Please specify either the phone number or emaill address",
      );
    }
    userInfo.value.name == "" &&
      errors.value.push("Please specify the owner's name");
    userInfo.value.surname == "" &&
      errors.value.push("Please specify the owner's surname");
  }
  if (petCreationMode.value == "existing" && !selectedPet.value) {
    errors.value.push("Please select the existing pet");
  }
  if (petInfo.value.specie == "other") {
    if (!otherSpecie.value || otherSpecie.value == "") {
      errors.value.push("Please specify the pet specie");
    }
  }
  if (!selectedTime.value) {
    toast.add({
      severity: "error",
      summary: "Info required",
      detail: "Reservation Time not specified",
    });
    errors.value.push("Please select the reservation time");
    return;
  }
  const formData: CreateReservationParams = {
    userInfo:
      userCreationMode.value == "existing" && selectedUser.value
        ? { id: selectedUser.value.id }
        : userInfo.value,
    petInfo:
      petCreationMode.value == "existing" && selectedPet.value
        ? { id: selectedPet.value.id }
        : petInfo.value,
    reservationInfo: {
      date: toReservationDate(reservationInfo.value.date),
      time: selectedTime.value,
      service: reservationInfo.value.service,
    },
  };

  if (!("id" in formData.petInfo) && formData.petInfo.specie == "other") {
    formData.petInfo.specie = otherSpecie.value ?? "";
  }

  if (errors.value.length > 0) return;

  store
    .create(formData, (err) => {
      toast.add({
        severity: "error",
        life: 5000,
        summary: `Reservation error `,
        detail: `${err.message}`,
      });
    })
    .then(({ error }) => {
      console.log("done");
      if (!error) {
        toast.add({
          severity: "success",
          life: 5000,
          summary: "Done !",
        });
        props.close();
      }
    });
};

onMounted(() => {
  fetchUsers();
  fetchPets();
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="p-fluid">
    <Message v-if="errors.length > 0" severity="error">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </Message>
    <!-- User Information Section -->
    <Fieldset legend="User Information">
      <div class="mb-2">
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
          class="w-full justify-center"
        />
      </div>

      <div v-if="userCreationMode == 'existing'">
        <div class="field column gap-15px">
          <label for="userSelect">Select User</label>
          <Select
            id="userSelect"
            v-model="selectedUser"
            :options="filteredUsers"
            optionLabel="name"
            placeholder="Select a user"
            class="w-300px"
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
      <div v-else class="column">
        <div class="row">
          <FloatLabel variant="in" class="field">
            <label for="name">First Name</label>
            <InputText id="name" v-model="userInfo.name" required />
          </FloatLabel>

          <FloatLabel variant="in" class="field gap-1px">
            <label for="surname">Last Name</label>
            <InputText id="surname" v-model="userInfo.surname" required />
          </FloatLabel>
        </div>
        <FloatLabel variant="in" class="field gap-15px">
          <label for="email">Email</label>
          <InputText id="email" v-model="userInfo.email" type="email" />
        </FloatLabel>

        <FloatLabel variant="in" class="field gap-15px">
          <label for="phoneNumber">Phone Number</label>
          <InputText id="phoneNumber" v-model="userInfo.phoneNumber" />
        </FloatLabel>
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
          class="w-full justify-center"
        />
      </div>

      <div v-if="petCreationMode == 'existing'">
        <div class="field column gap-15px">
          <label for="petSelect">Select Pet</label>
          <Select
            id="petSelect"
            v-model="selectedPet"
            :options="filteredPets"
            optionLabel="name"
            placeholder="Select a pet"
            class="w-300px"
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

      <div v-else class="column gap-15px">
        <FloatLabel variant="in" class="pad-15px">
          <label for="petName">Pet Name</label>
          <InputText id="petName" v-model="petInfo.name" required />
        </FloatLabel>

        <div class="column">
          <Select
            :options="speciesOptions"
            class="w-300px"
            id="specie"
            name="specie"
            placeholder="Select your pet specie"
            v-model="petInfo.specie"
            optionLabel="label"
            optionValue="value"
            required
          />
          <FloatLabel
            variant="in"
            v-if="petInfo.specie == 'other'"
            class="column gap-15px pad-10px"
          >
            <label for="otherSpecie">Specify Specie</label>
            <InputText id="otherSpecie" v-model="otherSpecie" required />
          </FloatLabel>
        </div>
      </div>
    </Fieldset>

    <!-- Reservation Information Section -->
    <Fieldset legend="Reservation Details" class="mt-4">
      <div class="pad-5 column">
        <label for="service">Service</label>
        <Select
          :options="services"
          class="w-300px"
          id="service"
          name="service"
          placeholder="Select a service"
          optionValue="value"
          optionLabel="label"
          required
          v-model="reservationInfo.service"
        />
      </div>
      <div class="field">
        <label for="date">Date</label>
        <DatePicker
          id="date"
          v-model="reservationInfo.date"
          dateFormat="dd/mm/yy"
          :min-date="new Date()"
          required
          @value-change="
            (v) => {
              if (v instanceof Date) onDateSelect(v);
            }
          "
        />
      </div>

      <div class="pad-5 column">
        <label class="pad-5" for="selectedTime">Time</label>
        <!-- <div class="row"> -->
        <Select
          :options="availableSlots"
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
        @click="close"
      />
      <Button type="submit" label="Create Reservation" />
    </div>
  </form>
</template>
