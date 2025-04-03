import { api } from "../../lib/client";
import type { ApiResponse, PetData } from "../../lib/types";
import { defineStore } from "pinia";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

export const usePetsStore = defineStore("pets", () => {
  const toast = useToast();

  const pets = ref<PetData[]>();
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
    const { data: _pets, error: _error } = data as ApiResponse<PetData[]>;
    if(_error){
      
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot fetch pets info",
      });
    }
    // console.log(_pets)
    error.value = _error
    pets.value = _pets;
  };

  const fetchPetById = async (id:number) => {
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
    const { data: _pets, error: _error } = data as ApiResponse<PetData[]>;
    if(_error){
      
      toast.add({
        severity: "error",
        detail: _error.message,
        summary: "Cannot fetch pets info",
      });
    }
    error.value = _error
    pets.value = _pets;
  };

  fetchPets()

  return {
    pets,
    error,
    refresh: fetchPets,
    getById: fetchPetById
  };
});
