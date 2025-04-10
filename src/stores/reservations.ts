import { defineStore } from "pinia";
import type {
  ApiResponse,
  CreateReservationParams,
  Reservation,
  ReservationRecord,
  TimeSlot,
} from "../../lib/types";
import { ref } from "vue";
import { api } from "../../lib/client";
import { today } from "../../lib/utils";

export const useReservationsStore = defineStore("reservations", () => {
  const reservations = ref<ReservationRecord[]>();
  const getAvailableSlots = async (date?: Date) => {
    const apiResponse = (
      await api.get(
        `/reservation/slots?date=${(date ?? new Date(today())).toISOString()}`,
      )
    ).data as ApiResponse<TimeSlot[]>;
      console.log(apiResponse)
    const { error, data } = apiResponse;
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

  const updateReservation = async (
    id: number,
    values: Partial<Reservation>,
  ) => {
    const response = await api.post(`/reservation/${id}`, values);
    const apiResponse = response as ApiResponse<ReservationRecord>;
    if (!apiResponse.error) {
      fetchReservations();
    }
  };

  const deleteReservation = async (id: number) => {
    const response = await api.delete(`/reservation/${id}`);
    const apiResponse = response as ApiResponse<ReservationRecord>;
    if (!apiResponse.error) {
      fetchReservations();
    }
  };

  const createReservation = async (
    data: CreateReservationParams,
    errorHandler?: (err: Error) => void,
  ): Promise<ApiResponse<ReservationRecord>> => {
    console.log("dta",data)
    const response = await api.post("/reservation", { ...data });
    if (!response.ok) {
      if (errorHandler) errorHandler(response.originalError);
      console.log(response);
      return { error: response.originalError };
    }
    const apiResponse = response.data as ApiResponse<ReservationRecord>;
    if (apiResponse.error) if (errorHandler) errorHandler(apiResponse.error);

    return apiResponse;
  };

  fetchReservations();

  return {
    reservations,
    getAvailableSlots,
    refresh: fetchReservations,
    update: updateReservation,
    delete: deleteReservation,
    create: createReservation,
  };
});
