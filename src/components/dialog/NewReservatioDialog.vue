<script lang="ts" setup>
//import { toast } from "vue3-toastify";
import { computed, ref, watch } from "vue";
import {
  CreateReservationSchema,
  getTimeFromString,
  type CreateReservationParams,
  type TimeSlot,
  type TimeString,
} from "../../../lib/types";
import { useToast } from "primevue/usetoast";
import { useReservationsStore } from "../../stores/reservations";
import { normalizedDate, sameDay, today } from "../../../lib/utils";
const options = ["Cat", "Dog", "Bird", "Other"];

const { getAvailableSlots } = useReservationsStore();

const toast = useToast();
const selectedDateRef = ref<Date>();
const selectedTime = ref<{ from: string; to: string }>();

const props = defineProps<{
  handleSubmit: (data: CreateReservationParams) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
}>();
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

const otherSpecie = ref("");

const selectedSpecie = computed(() => {
  console.log(petInfo, otherSpecie);
  if (petInfo.value.specie.toLowerCase() == "other") {
    return otherSpecie.value.trim() != ""
      ? otherSpecie.value.trim()
      : undefined;
  }
  return petInfo.value.specie;
});

//@ts-ignore
const submitReservation = async () => {
  //1. Validate Input
  if (!selectedTime.value) {
    toast.add({
      summary: "Please select a reservation time",
      severity: "error",
      life: 5000,
    });
    return;
  }
  console.log(selectedDateRef.value?.toDateString());
  if (selectedDateRef.value == undefined) {
    console.log(selectedDateRef);
    toast.add({
      severity: "error",
      summary: "Please select a valid date",
      life: 5000,
    });
    return;
  } else if (sameDay(selectedDateRef.value, today())) {
    if (selectedTime.value.from) {
      const now = new Date();
      const { hour, minute } = getTimeFromString(
        selectedTime.value.from as TimeString,
      );
      if (
        hour < now.getHours() ||
        (hour == now.getHours() && minute <= now.getMinutes())
      ) {
        console.log(selectedDateRef);
        toast.add({
          severity: "error",
          summary: "Please select a valid date",
          life: 5000,
        });
        return;
      }
    }
  }
  if (selectedSpecie.value == undefined) {
    toast.add({
      severity: "error",
      summary: "Missing pet specie",
      life: 5000,
    });
    return;
  }
  //2. Format data
  const data = {
    userInfo: { ...userInfo.value },
    petInfo: {
      ...petInfo.value,
      specie: selectedSpecie.value.toLowerCase(),
    },
    reservationInfo: {
      date: normalizedDate(selectedDateRef.value),
      time: selectedTime.value,
    },
  };
  const result = CreateReservationSchema.safeParse(data);
  console.log(result);

  //3. Send
  if (result.success) props.handleSubmit(data);
  else {
    result.error.issues.forEach((issue) => {
      toast.add({ severity: "error", summary: issue.message, life: 5000 });
    });
  }
};

//const slots = AvailableTimeSlots;
const slotsRef = ref<TimeSlot[]>();
const fetchSlots = (date?: Date) =>
  getAvailableSlots(date).then((slots) => {
    slotsRef.value = slots;
  });
watch(selectedDateRef, (value) => {
  console.log("date change", value);
  fetchSlots(value);
});
</script>
<template>
  <Form
    class="column gap-10"
    @submit="
      (_: any) => {
        console.log('k');
        submitReservation();
      }
    "
  >
    <div>
      <FieldSet legend="Client Info" class="pad-15">
        <div class="row">
          <FloatLabel class="pad-5" variant="in">
            <InputText
              id="name"
              name="name"
              class="w-150"
              v-model="userInfo.name"
              required
            />
            <label for="name">Name</label>
          </FloatLabel>
          <FloatLabel class="pad-5" variant="in">
            <InputText
              id="surname"
              name="surname"
              class="w-150"
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
              class="w-300"
              v-model="userInfo.email"
            />
          </FloatLabel>
          <FloatLabel class="pad-5" variant="in">
            <label for="phoneNumber">Phone</label>
            <InputText
              name="phoneNumber"
              id="phoneNumber"
              class="w-250"
              v-model="userInfo.phoneNumber"
            />
          </FloatLabel>
        </div>
      </FieldSet>
      <FieldSet legend="Pet Info" class="pad-15">
        <div class="row pad-5">
          <FloatLabel class="pad-5" variant="in">
            <label for="petName">Pet Name</label>
            <InputText
              id="petName"
              name="petName"
              class="w-150"
              v-model="petInfo.name"
              required
            />
          </FloatLabel>
        </div>
        <div class="flex column pad-5">
          <label class="pad-5" for="selectedSpecie">Specie</label>
          <!-- <div class="row"> -->
          <Select
            :options="options"
            class="w-300"
            id="selectedSpecie"
            name="selectedSpecie"
            placeholder="Select your pet specie"
            v-model="petInfo.specie"
            required
          />
          <FloatLabel
            variant="in"
            v-if="petInfo.specie.toLowerCase() == 'other'"
            :required="petInfo.specie.toLowerCase() == 'other'"
          >
            <label for="specieName">Specie</label>
            <InputText
              id="specieName"
              name="specieName"
              class="w-200"
              v-model="otherSpecie"
            />
          </FloatLabel>
          <!-- </div> -->
        </div>
      </FieldSet>
      <FieldSet legend="Reservation">
        <div class="row">
          <FloatLabel class="pad-5" variant="in">
            <label for="reservationDate">Date</label>
            <DatePicker
              id="reservationDate"
              name="reservationDate"
              class="w-150"
              date-format="dd/mm/yy"
              :min-date="new Date(new Date().setHours(0, 0, 0))"
              v-model="selectedDateRef"
              required
            />
          </FloatLabel>
        </div>
        <div class="pad-5 column">
          <label class="pad-5" for="selectedTime">Time</label>
          <!-- <div class="row"> -->
          <Select
            :options="slotsRef"
            class="w-300"
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
                <div>
                  {{ slotProps.option.from }} - {{ slotProps.option.to }}
                </div>
              </div>
            </template>
          </Select>
        </div>
      </FieldSet>
    </div>
    <div class="row gap-10">
      <Button label="Submit" type="submit" />
      <Button label="Cancel" @click="handleCancel()" />
    </div>
  </Form>
</template>
