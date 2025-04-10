<script lang="ts" setup>
import { computed } from "vue";
import {
  type ReservationRecord,
  formatReservationDate,
} from "../../../lib/types";

const props = defineProps<{
  item: ReservationRecord;
}>();
const icon = computed(() => {
  if (props.item.pet.specie.includes("dog")) return "dog";
  if (props.item.pet.specie.includes("cat")) return "cat";
  if (props.item.pet.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});
</script>
<template>
  <div>
    <strong>Created at </strong>
    {{ new Date(item.reservation.createdAt).toLocaleDateString() }}
    <FieldSet legend="Client Info">
      <div class="column pad-5">
        <strong>Name</strong>
        <span class="w-200">
          {{ `${item.user.name} ${item.user.surname}` }}
        </span>
        <strong>Date</strong>
        <span class="w-200"
          >{{
            formatReservationDate(item.reservation.date).toLocaleDateString()
          }}
        </span>
      </div>
      <div class="row pad-5">
        <strong>Email</strong>
        <span class="w-200">
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
        <span class="w-200">
          {{
            item.user.phoneNumber && item.user.phoneNumber.trim() != ""
              ? item.user.phoneNumber
              : "None"
          }}</span
        >
      </div>
    </FieldSet>
    <FieldSet legend="Pet Info">
      <div class="row pad-5">
        <strong>Pet Name</strong> <span> {{ item.pet.name }} </span>
        <strong>Specie</strong>
        <span>
          {{ item.pet.specie }}
        </span>
      </div>
      <FaIcon :icon="`fa-${icon}`" />
    </FieldSet>
  </div>
  <!-- <Button -->
  <!-- type="button" -->
  <!-- label="Close" -->
  <!-- severity="secondary" -->
  <!-- @click="showInfo = false" -->
  <!-- ></Button> -->
</template>
