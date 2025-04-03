import { defineStore } from "pinia";
import type { ApiResponse, UserData } from "../../lib/types";
import { ref } from "vue";
import { api } from "../../lib/client";
import { useAuth } from "../states/auth";

export const useAccountsStore = defineStore("accounts", () => {
  const auth = useAuth();

  const MAX_TRIES = 3;
  const accounts = ref<UserData[]>();
  const error = ref<any>();
  const fetchAccounts = async (currentTry?: number) => {
    try {
      const { data, ok, status } = await api.get("/user", {
        withCredentials: true,
        headers: { ...auth.getAuthHeader() },
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
          console.log("resullt",result);
        }
        fetchAccounts((currentTry ?? 0) + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchAccounts();

  return {
    accounts,
    error,
    refresh: fetchAccounts,
  };
});
