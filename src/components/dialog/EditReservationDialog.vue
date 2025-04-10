<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  formatReservationDate,
  toReservationDate,
  type Reservation,
  type ReservationRecord,
  type TimeSlot,
} from "../../../lib/types";
import { AvailableTimeSlots } from "../../constants";

const slots = AvailableTimeSlots;
const props = defineProps<{
  item: ReservationRecord;
  handleSubmit: <T>(values: Partial<Reservation>) => Promise<T>;
}>();
const icon = computed(() => {
  if (props.item.pet.specie.includes("dog")) return "dog";
  if (props.item.pet.specie.includes("cat")) return "cat";
  if (props.item.pet.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});
const selectedDateRef = ref(formatReservationDate(props.item.reservation.date));
const selectedTime = ref<TimeSlot>(props.item.reservation.time);

const updateReservation = async () => {
  //const { ok, data } = await api.patch("/reservation", {
  //  date: selectedDateRef.value,
  //  time: selectedTime.value,
  //});
  //if (ok) {
  //  const { error } = data as ApiResponse<ReservationRecord>;
  //  if (error) {
  //  } else {
  //    toast.add({ severity: "success", summary: "Reservation updated" });
  //  }
  //}

  props.handleSubmit({
    date: toReservationDate(selectedDateRef.value),
    time: selectedTime.value as TimeSlot,
  });
};
</script>
<template>
  <div>
    <strong>Created at </strong>
    {{ new Date(item.reservation.createdAt).toLocaleDateString() }}
    <FieldSet legend="Client Info">
      <div class="row pad-5">
        <strong>Name</strong>
        <span class="w-200px">
          {{ `${item.user.name} ${item.user.surname}` }}
        </span>
      </div>
      <div class="row pad-5">
        <strong>Email</strong>
        <span class="w-200px">
          {{
            item.user.email
              ? item.user.email != ""
                ? item.user.email
                : "None"
              : "None"
          }}</span
        >
      </div>
      <div class="row pad-5">
        <strong>Phone</strong>
        <span class="w-200px">
          {{
            item.user.phoneNumber && item.user.phoneNumber.trim() != ""
              ? item.user.phoneNumber
              : "None"
          }}</span
        >
      </div>
    </FieldSet>
    <FieldSet legend="Pet Info">
      <div class="column pad-5">
        <strong>Pet Name</strong> <span> {{ item.pet.name }} </span>
        <br />
        <strong>Specie</strong>
        <span>
          {{ item.pet.specie }}
        </span>
      </div>
      <FaIcon :icon="`fa-${icon}`" />
    </FieldSet>

    <FieldSet legend="Reservation">
      <div class="row">
        <FloatLabel class="pad-5" variant="in">
          <label for="reservationDate">Date</label>
          <DatePicker
            id="reservationDate"
            name="reservationDate"
            class="w-150px"
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
          :options="slots"
          class="w-300px"
          id="selectedTime"
          name="selectedTime"
          placeholder="Select a time slot"
          v-model="selectedTime"
          :value="selectedTime"
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
    </FieldSet>
    <div class="row pad-10">
      <Button
        label="Save"
        severity="contrast"
        icon="pi pi-save"
        iconPos="right"
        @click="updateReservation()"
      />
      <Button label="Cancel" severity="secondary" />
      <Spacer fill="true" />
      <Button
        label="Delete"
        severity="danger"
        icon="pi pi-trash"
        iconPos="right"
      />
    </div>
  </div>
  <!-- <Button -->
  <!-- type="button" -->
  <!-- label="Close" -->
  <!-- severity="secondary" -->
  <!-- @click="showInfo = false" -->
  <!-- ></Button> -->
</template>
