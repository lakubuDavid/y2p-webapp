import { defineStore } from "pinia";
import { api } from "../../lib/client";
import type { ApiResponse, UserData } from "../../lib/types";
// import { useToast } from "primevue/usetoast";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  // const toast = useToast();
  const user = ref<UserData>();
  const error = ref<Error>();

  const fetchUser = async () => {
    const { data, ok, originalError } = await api.get("/user/me");
    if (!ok) {
      // toast.add({
      //   severity: "error",
      //   summary: "Cannot fetch userr info",
      //   detail: originalError.message,
      // });
      console.log(originalError)
      error.value = originalError
      return;
    }
    const { data: userData, error: _error } = data as ApiResponse<UserData>;
    if (_error) {
      // toast.add({
      //   severity: "error",
      //   detail: _error.message,
      //   summary: "Cannot fetch user info",
      // });
      console.log(_error)
    }
    error.value = _error;

    user.value = userData;
  };
  fetchUser()
  return { user, error, refresh: fetchUser };
});
