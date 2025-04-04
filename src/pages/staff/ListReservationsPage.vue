<script setup lang="ts">
import Layout from "../../layouts/staff.vue";
import ReservationListItem from "../../components/ReservationListItem.vue";
import NewReservationDialog from "../../components/dialog/NewReservatioDialog.vue";
import { ref } from "vue";
import { api } from "../../../lib/client";
import type { ApiResponse, CreateReservationParams } from "../../../lib/types";
import { useToast } from "primevue/usetoast";
import { useReservationsStore } from "../../stores/reservations";
import { storeToRefs } from "pinia";
const toast = useToast();
//const router = useRouter();

const showNewReservationDialog = ref(false);

const store = useReservationsStore();
const { reservations: reservationsRef } = storeToRefs(store);
const { refresh: fetchReservations } = store;
</script>
<template>
  <div class="__main">
    <Layout>
      <h1>Reservations Records</h1>
      <div>
        <Toolbar>
          <template #start>
            <Button
              icon="pi pi-plus"
              label="New"
              class="mr-2"
              severity="secondary"
              @click="showNewReservationDialog = true"
              text
            />
            <Button
              icon="pi pi-refresh"
              class="mr-2"
              severity="secondary"
              @click="fetchReservations()"
              text
            />
            <!-- <IconField> -->
            <!-- <InputIcon> -->
            <!-- <i class="pi pi-search" /> -->
            <!-- </InputIcon> -->
            <!-- <InputText class="w-400" placeholder="Search" /> -->
            <!-- </IconField> -->
            <!-- <Button icon="pi pi-search" severity="secondary" text /> -->
          </template>
        </Toolbar>
        <!-- <div class="row gap-10"> -->
        <!-- <Button @click="showNewReservationDialog = true" label="New" /> -->
        <!-- <Button -->
        <!-- variant="outlined" -->
        <!-- icon="pi pi-refresh" -->
        <!-- iconPos="right" -->
        <!-- @click="fetchReservations()" -->
        <!-- label="Refresh" -->
        <!-- /> -->
        <!-- </div> -->
        <!-- <Divider /> -->
        <div>
          <Dialog
            v-model:visible="showNewReservationDialog"
            modal
            header="New Reservation"
            :style="{ width: '40rem' }"
          >
            <NewReservationDialog
              :handle-cancel="
                () => {
                  showNewReservationDialog = false;
                }
              "
              :handleSubmit="
                async (data: CreateReservationParams) => {
                  const response = await api.post('/reservation', data);
                  if (response.ok) {
                    toast.add({
                      severity: 'success',
                      summary: 'Reservation done!',
                      life: 5000,
                    });
                    showNewReservationDialog = false;
                  } else {
                    toast.add({
                      severity: 'error',
                      life: 5000,
                      summary: `Reservation error : ${
                        (response.data as ApiResponse<any>).error ||
                        response.problem
                      }`,
                    });
                  }
                  console.log(response.data);
                }
              "
            />
          </Dialog>
          <DataView
            :value="reservationsRef"
            paginator
            :rows="5"
            data-key="id"
            paginatorPosition="top"
          >
            <template #list="list">
              <div
                v-for="(item, index) in list.items"
                class="pad-y-10"
                :key="index"
              >
                <ReservationListItem :item="item" />
              </div>
            </template>
          </DataView>
        </div>
      </div>
    </Layout>
  </div>
</template>
<style scoped>
.__main {
  height: 100%;
}
</style>
