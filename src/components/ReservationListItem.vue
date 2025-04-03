<script setup lang="ts">
import { capitalize, computed, ref } from "vue";
import type { ReservationRecord } from "../../lib/types";
import ShowReservationDialog from "./dialog/ShowReservationDialog.vue";
import EditReservationDialog from "./dialog/EditReservationDialog.vue";

const props = defineProps<{
  item: ReservationRecord;
}>();

const showInfo = ref(false);
const showEdit = ref(false);

const icon = computed(() => {
  if (props.item.pet.specie.includes("dog")) return "dog";
  if (props.item.pet.specie.includes("cat")) return "cat";
  if (props.item.pet.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});

const onViewClick = (ev: Event) => {
  ev.preventDefault();
  showInfo.value = true;
};
const onEditClick = (ev: Event) => {
  ev.preventDefault();
  showEdit.value = true;
};
</script>
<template lang="">
  <div>
    <Card class="margin-5">
      <template #content>
        <div class="list-item">
          <div class="row">
            <span>
              <strong>Owner : </strong>
              {{ `${item.user.name} ${item.user.surname}` }}</span
            >
            <span>
              <strong>Date : </strong>
              {{ new Date(item.reservation.date).toLocaleDateString() }}</span
            >
          </div>
          <div class="row">
            <span
              ><strong>Specie : </strong> {{ capitalize(item.pet.specie) }}
              <FaIcon :icon="`fa-${icon}`" />
            </span>
            <span> <strong>Name : </strong> {{ item.pet.name }}</span>
            <span
              ><Tag
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
              ></Tag
            ></span>
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
            <EditReservationDialog :item="item" />
          </Dialog>
        </div>
      </template>
    </Card>
  </div>
</template>
<style scoped>
.list-item {
  padding: 5px 10px;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
</style>
