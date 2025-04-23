import { defineStore } from "pinia";
import type {
  ApiResponse,
} from "../../lib/types";
import { ref } from "vue";
import { api } from "../../lib/client";
import { useToast } from "primevue/usetoast";
import type { CreateUserParams, StaffUserData, UserData } from "../models/user";
import { useAuthStore } from "./auth";

export const useAccountsStore = defineStore("accounts", () => {

  const auth = useAuthStore();
  const toast = useToast()

  const MAX_TRIES = 3;
  const accounts = ref<UserData[]>();
  const error = ref<any>();
  const fetchAccounts = async (currentTry?: number) => {
    try {
      const { data, ok, status } = await api.get("/user", {
        withCredentials: true,
      });
      if (ok) {
        const { data: rData, error: err } = data as ApiResponse<UserData[]>;
        if (err) {
          console.log(err);
          error.value = err;
        } else {
          accounts.value = rData;
        }
      } else {
        if (currentTry && currentTry >= MAX_TRIES) {
          return;
        }
        if (status == 401) {
          const result = await auth.refreshToken();
          console.log("resullt", result);
        }
        fetchAccounts((currentTry ?? 0) + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function createUser(
    info: CreateUserParams,
    errHandler?: (err: Error) => any,
  ) {
    try {
      const { data, ok, originalError } = await api.post("/admin/users", info, {
        withCredentials: true,
      });

      if (!ok) {
        if (errHandler) errHandler(originalError);
        toast.add({
          severity:'error',
          summary:"An error occured whille creating new user",
          detail:originalError.message
        })
        return { success: false, error: originalError };
      }
      const apiResponse = data as ApiResponse<StaffUserData>;
      if (apiResponse.error) {
        if (errHandler) errHandler(apiResponse.error);
        toast.add({
          severity:'error',
          summary:"An error occured whille creating new user",
          detail:apiResponse.message ?? apiResponse.error.message
        })
        return { success: false, error: error};
      }

        toast.add({
          severity:'success',
          summary:"Done !",
          detail:`A link to login as been sent to ${info.email}`
        })
    } catch (err) {}
  }

  fetchAccounts();

  return {
    accounts,
    error,
    refresh: fetchAccounts,
    create: createUser,
  };
});
