<script setup lang="ts">
import Layout from "../../layouts/staff.vue";
import ReservationListItem from "../../components/ReservationListItem.vue";
import { ref } from "vue";
//import { api } from "../../../lib/client";
//import type { ApiResponse, CreateReservationParams } from "../../../lib/types";
import { useToast } from "primevue/usetoast";
import { useReservationsStore } from "../../stores/reservations";
import { storeToRefs } from "pinia";
import type { CreateReservationParams } from "@lib/types";
import CreateReservationDialog from "@components/dialog/CreateReservationDialog.vue";
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
          </template>
        </Toolbar>
        <div>
          <Dialog
            v-model:visible="showNewReservationDialog"
            modal
            header="New Reservation"
            :style="{ width: '40rem' }"
          >
            <!-- <NewReservationDialog -->
            <!-- :handle-cancel=" -->
            <!-- () => { -->
            <!-- showNewReservationDialog = false; -->
            <!-- } -->
            <!-- " -->
            <!-- :handleSubmit=" -->
            <!-- (data: CreateReservationParams) => { -->
            <!-- store -->
            <!-- .create(data, (err) => { -->
            <!-- toast.add({ -->
            <!-- severity: 'error', -->
            <!-- life: 5000, -->
            <!-- summary: `Reservation error : ${err}`, -->
            <!-- }); -->
            <!-- }) -->
            <!-- .then(({ error }) => { -->
            <!-- console.log('done'); -->
            <!-- if (!error) { -->
            <!-- toast.add({ -->
            <!-- severity: 'success', -->
            <!-- life: 5000, -->
            <!-- summary: 'Done !', -->
            <!-- }); -->
            <!-- } -->
            <!-- }); -->
            <!-- } -->
            <!-- " -->
            <!-- /> -->
            <CreateReservationDialog
              :handle-cancel="
                () => {
                  showNewReservationDialog = false;
                }
              "
              :handleSubmit="
                (data: CreateReservationParams) => {
                  store
                    .create(data, (err) => {
                      toast.add({
                        severity: 'error',
                        life: 5000,
                        summary: `Reservation error : ${err}`,
                      });
                    })
                    .then(({ error }) => {
                      console.log('done');
                      if (!error) {
                        toast.add({
                          severity: 'success',
                          life: 5000,
                          summary: 'Done !',
                        });
                      }
                    });
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
                <!-- @ts-ignore -->
                <ReservationListItem
                  :item="item"
                  :handleUpdate="
                    async (values: any) => {
                      await store
                        .update(item.reservation.id, values, (error) => {
                          toast.add({
                            severity: 'danger',
                            life: 5000,
                            summary: `Reservation update error : ${error.message}`,
                          });
                        })
                        .then(({ error }) => {
                          if (!error) {
                            toast.add({
                              severity: 'success',
                              life: 5000,
                              summary: 'Done !',
                            });
                          }
                        });
                    }
                  "
                />
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
