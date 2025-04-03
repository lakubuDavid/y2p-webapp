import { defineStore } from "pinia";
import type { ApiResponse, ReservationRecord, TimeSlot } from "../../lib/types";
import { ref } from "vue";
import { api } from "../../lib/client";
import { today } from "../../lib/utils";

export const useReservationsStore = defineStore("reservations", () => {
  const reservations = ref<ReservationRecord[]>();
  const getAvailableSlots = async (date?: Date) => {
    const { data, error } = (
      await api.get(
        `/reservation/slots?date=${(date ?? today()).toISOString()}`,
      )
    ).data as ApiResponse<TimeSlot[]>;
    if (error) {
      return [];
    }
    return data;
  };

  // const reservations = computed(() => {
  //   _reservations.value;
  // })

  const fetchReservations = async () => {
    const response = await api.get("/reservation");
    reservations.value = (
      response.data as ApiResponse<ReservationRecord[]>
    ).data;
  };

  fetchReservations();

  return {
    reservations,
    getAvailableSlots,
    refresh: fetchReservations,
  };
});
