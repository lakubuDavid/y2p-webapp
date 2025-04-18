<script setup lang="ts">
//@ts-ignore
import { capitalize, computed, ref } from "vue";
//@ts-ignore
import { toDate, type Reservation, type ReservationRecord } from "@lib/types";
//import ShowReservationDialog from "./dialog/ShowReservationDialog.vue";
//import EditReservationDialog from "./dialog/EditReservationDialog.vue";

const props = defineProps<{
  item: ReservationRecord;
  handleUpdate: (values: Partial<Reservation>) => Promise<any>;
}>();

console.log(props.item);

const showInfo = ref(false);
const showEdit = ref(false);

//@ts-ignore
const date = computed(() => {
  const _date = toDate(props.item.reservation.date);

  return _date;
});

//@ts-ignore
const icon = computed(() => {
  if (props.item.pet.specie.includes("dog")) return "dog";
  if (props.item.pet.specie.includes("cat")) return "cat";
  if (props.item.pet.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});

//@ts-ignore
const onViewClick = (ev: Event) => {
  ev.preventDefault();
  showInfo.value = true;
};
//@ts-ignore
const onEditClick = (ev: Event) => {
  ev.preventDefault();
  showEdit.value = true;
};

//console.log(props.item);
</script>
<template lang="">
  <div class="flex flex-row items-center gap-10px">
    <div class="column gap-10px grow-1">
      <!-- <Card class="margin-5"> -->
      <!-- <template #content> -->
      <!-- <div class="list-item"> -->
      <div class="row">
        <h3>Reservation #{{ item.reservation.reservationNumber }}</h3>
        <Tag
          :severity="
            item.reservation.status == 'oncoming'
              ? 'contrast'
              : item.reservation.status == 'done'
                ? 'success'
                : item.reservation.status == 'canceled'
                  ? 'secondary'
                  : item.reservation.status == 'rescheduled'
                    ? 'info'
                    : item.reservation.status == 'late'
                      ? 'warn'
                      : 'secondary'
          "
          :value="item.reservation.status"
        ></Tag>
      </div>
      <div class="row gap-20px">
        <span>
          <strong>Owner : </strong>
          {{ `${item.user.name} ${item.user.surname}` }}</span
        >
      </div>
      <div class="row gap-20px">
        <span class="min-w-200px">
          <strong>Date : </strong>
          {{ date.toLocaleDateString() }}</span
        >
        <span class="min-w-200px">
          <strong>Time : </strong>
          {{ item.reservation.time.from }} - {{ item.reservation.time.to }}
        </span>
      </div>
      <div class="row gap-20px">
        <span class="min-w-200px"
          ><strong>Specie : </strong> {{ capitalize(item.pet.specie) }}
          <FaIcon :icon="`fa-${icon}`" />
        </span>
        <span class="min-w-200px">
          <strong>Name : </strong> {{ item.pet.name }}</span
        >
      </div>
      <Dialog
        v-model:visible="showInfo"
        modal
        header="Reservation Infos"
        :style="{ width: '40rem' }"
      >
        <ShowReservationDialog :item="item" />
      </Dialog>
      <Dialog
        v-model:visible="showEdit"
        modal
        header="Edit reservation"
        :style="{ width: '40rem' }"
      >
        <EditReservationDialog
          :item="item"
          :handleSubmit="handleUpdate"
          :close="() => (showEdit = false)"
        />
      </Dialog>
    </div>
    <div class="row">
      <Button
        icon="pi pi-eye"
        severity="secondary"
        @click="onViewClick"
        rounded
      />
      <Button
        icon="pi pi-pencil"
        severity="secondary"
        @click="onEditClick"
        rounded
      />
    </div>
  </div>
</template>
<style scoped>
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
</style>
