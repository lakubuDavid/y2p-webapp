<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../../lib/client";
import type { ApiResponse, ReservationRecord } from "../../lib/types";
import { toDate } from "@lib/types";
import Layout from "@layouts/accessform.vue";
import { useRoute, type LocationQueryValue } from "vue-router";

const route = useRoute();
const queryNumber = (route.query["number"] as LocationQueryValue)?.toString();

const reservationNumber = ref(queryNumber ?? "");
const reservation = ref<ReservationRecord | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

const checkStatus = async () => {
  if (!reservationNumber.value) {
    error.value = "Please enter a reservation number";
    return;
  }

  loading.value = true;
  error.value = null;
  reservation.value = null;

  try {
    const response = await api.get(
      `/reservation/check/${reservationNumber.value}`,
    );
    const data = response.data as ApiResponse<ReservationRecord>;

    if (data.error) {
      error.value =
        typeof data.error === "string"
          ? data.error
          : "Could not find the reservation. Please check the number and try again.";
    } else if (data.data) {
      reservation.value = data.data;
    }
  } catch (err) {
    error.value = "An error occurred while checking the reservation.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    oncoming: "Scheduled",
    done: "Completed",
    canceled: "Canceled",
    rescheduled: "Rescheduled",
    late: "Missed",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    oncoming: "bg-blue-100 text-blue-900", // status-scheduled
    done: "bg-green-100 text-green-900", // status-completed
    canceled: "bg-red-100 text-red-900", // status-canceled
    rescheduled: "bg-amber-100 text-amber-900", // status-rescheduled
    late: "bg-purple-100 text-purple-900", // status-missed
  };
  return classMap[status] || "";
};

onMounted(() => {
  if (reservationNumber.value != "") {
    checkStatus();
  }
  console.log(route.query);
});
</script>

<template>
  <Layout name="Check Reservation ">
    <div class="max-w-600px mx-auto p-8">
      <h1 class="text-2xl font-bold">Check Reservation Status</h1>

      <div class="my-8">
        <div class="gap-10px column">
          <FloatLabel varient="in">
            <label for="reservationNumber"> Reservation No </label>
            <InputText
              name="reservationNumber"
              id="reservationNumber"
              v-model="reservationNumber"
              @keyup.enter="checkStatus"
              class="pad-5px w-300px"
            />
          </FloatLabel>
          <Button
            label="Check Status"
            @click="checkStatus"
            :loading="loading"
          />
        </div>
        <small class="block mt-2 text-gray-500"
          >Example: VET-20230428-ABC1</small
        >
      </div>

      <div v-if="error" class="mt-4">
        <Message severity="error">{{ error }}</Message>
      </div>

      <div v-if="reservation" class="mt-8">
        <div
          class="border border-gray-300 rounded-lg shadow-sm overflow-hidden"
        >
          <div
            class="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-300"
          >
            <h2 class="text-lg font-semibold m-0">Reservation Details</h2>
            <div
              :class="[
                'px-3 py-1 rounded-full text-sm font-semibold',
                getStatusClass(reservation.reservation.status),
              ]"
            >
              {{ getStatusLabel(reservation.reservation.status) }}
            </div>
          </div>

          <div class="p-4">
            <div class="flex mb-4">
              <div class="w-2/5 font-semibold text-gray-600">
                Reservation Number:
              </div>
              <div class="w-3/5">
                {{ reservation.reservation.reservationNumber }}
              </div>
            </div>

            <div class="flex mb-4">
              <div class="w-2/5 font-semibold text-gray-600">Pet Name:</div>
              <div class="w-3/5">{{ reservation.pet.name }}</div>
            </div>

            <div class="flex mb-4">
              <div class="w-2/5 font-semibold text-gray-600">Date:</div>
              <div class="w-3/5">
                {{ toDate(reservation.reservation.date).toLocaleDateString() }}
              </div>
            </div>

            <div class="flex mb-4">
              <div class="w-2/5 font-semibold text-gray-600">Time:</div>
              <div class="w-3/5">
                {{ reservation.reservation.time.from }} -
                {{ reservation.reservation.time.to }}
              </div>
            </div>

            <div class="flex mb-4">
              <div class="w-2/5 font-semibold text-gray-600">Created:</div>
              <div class="w-3/5">
                {{
                  new Date(reservation.reservation.createdAt).toLocaleString()
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
