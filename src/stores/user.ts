import { defineStore } from "pinia";
import { api } from "../../lib/client";
import type { ApiResponse } from "../../lib/types";
// import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import type { UserData } from "../models/user";

export const useUserStore = defineStore("user", () => {
  // const toast = useToast();
  const currentUser = ref<UserData>();
  const error = ref<Error>();

  const fetchUser = async () => {
    const { data, ok, originalError } = await api.get("/user/me");
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    const { data: userData, error: _error } = data as ApiResponse<UserData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;

    currentUser.value = userData;
  };

  const updateUser = async (id: number, value: any) => {
    const { data, ok, originalError } = await api.patch(`/user/${id}`, value);
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    const { data: userData, error: _error } = data as ApiResponse<UserData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;

    currentUser.value = userData;
  };
  const deleteUser = async (id: number) => {
    const { data, ok, originalError } = await api.delete(`/user/${id}`);
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    const { data: userData, error: _error } = data as ApiResponse<UserData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;

    currentUser.value = userData;
  };
  const signout = async () => {
    const { data, ok, originalError } = await api.get(`/auth/logout`);
    if (!ok) {
      console.log(originalError);
      error.value = originalError;
      return;
    }
    const { error: _error } = data as ApiResponse<UserData>;
    if (_error) {
      console.log(_error);
    }
    error.value = _error;
  };
  fetchUser();
  return {
    currentUser: currentUser,
    error,
    refresh: fetchUser,
    update: updateUser,
    delete: deleteUser,
    signout,
  };
});
