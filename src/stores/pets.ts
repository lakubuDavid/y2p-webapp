import { api } from "../../lib/client";
import type { ApiResponse } from "../../lib/types";
import type { UpdatePetParams } from "@lib/schemas";
import { defineStore } from "pinia";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import type { PetData, PetInfo, PetRecord } from "../models/pet";
import type { ReservationHistoryRow } from "../models/reservation";


export const usePetsStore = defineStore("pets", () => {
  const toast = useToast();

  const pets = ref<PetRecord[]>([]);

  const loading = ref(false);
  const error = ref<Error>();

  const fetchPets = async () => {
    const { ok, data, originalError } = await api.get("/pet");
    if (!ok) {
      toast.add({
        severity: "error",
        summary: "Cannot fetch pets info",
        detail: originalError.message,
      });
      error.value = originalError;
      return;
    }
    // console.log("data",data)
    const { data: _pets, error: _error } = data as ApiResponse<PetRecord[]>;
    if (_error) {
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot fetch pets info",
      });
    }
    // console.log(_pets)
    error.value = _error;
    pets.value = _pets ?? [];
  };

  const fetchPetById = async (id: number) => {
    const { ok, data, originalError } = await api.get(`/pet/${id}`);
    if (!ok) {
      toast.add({
        severity: "error",
        summary: "Cannot fetch pets info",
        detail: originalError.message,
      });
      error.value = originalError;
      return;
    }
    const { data: pet, error: _error } = data as ApiResponse<PetInfo>;
    if (_error) {
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot fetch pets info",
      });
    }
    error.value = _error;
    console.log(data);
    return pet;
  };

  const updatePetInfo = async (
    id: number,
    value: UpdatePetParams,
    errHandler: (error: Error) => any,
  ) => {
    const { ok, data, originalError } = await api.patch(`/pet/${id}`, value);
    if (!ok) {
      toast.add({
        severity: "error",
        summary: "Cannot update pets info",
        detail: originalError.message,
      });
      if (errHandler) errHandler(originalError);
      error.value = originalError;
      return { error: originalError };
    }
    const { data: pet, error: _error } = data as ApiResponse<PetInfo>;
    if (_error) {
      if (errHandler) errHandler(_error);
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot update pets info",
      });
    }
    error.value = _error;
    return { data: pet, error: _error };
  };

  const deletePet = async (id: number) => {
    const { ok, data, originalError } = await api.delete(`/pet/${id}`);
    if (!ok) {
      toast.add({
        severity: "error",
        summary: "Cannot delete pet",
        detail: originalError.message,
      });
      error.value = originalError;
      return;
    }
    const { data: pet, error: _error } = data as ApiResponse<PetInfo>;
    if (_error) {
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot delete pet",
      });
    } else {
      toast.add({
        severity: "success",
        summary: "Done !",
      });
    }
    error.value = _error;
    return pet;
  };

  const getHistory = async (id: number) => {
    const { ok, data, originalError } = await api.get(`/pet/${id}/history`);
    if (!ok) {
      toast.add({
        severity: "error",
        summary: "Cannot fetch pets info",
        detail: originalError.message,
      });
      error.value = originalError;
      return;
    }
    const { data: pet, error: _error } = data as ApiResponse<
      ReservationHistoryRow[]
    >;
    if (_error) {
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot fetch pets info",
      });
    }
    error.value = _error;
    console.log(data);
    return pet;
  };
  const create = async (petData: {
    name: string;
    specie: string;
    ownerId: number;
    metadata?: Record<string, any>;
  }): Promise<PetData | undefined> => {
    loading.value = true;
    error.value = undefined;

    try {
      const response = await api.post("/pet", petData);

      if (response.ok && response.data) {
        const newPet = (response.data as ApiResponse<PetData>).data ;

        // Add the new pet to the store
        fetchPets()

        return newPet;
      } else {
        throw new Error((response.data as any)?.error || "Failed to create pet");
      }
    } catch (err) {
      console.error("Error creating pet:", err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return undefined;
    } finally {
      loading.value = false;
    }
  };
  fetchPets();

  return {
    pets,
    error,
    refresh: fetchPets,
    getById: fetchPetById,
    getHistory,
    update: updatePetInfo,
    delete: deletePet,
    create
  };
});
