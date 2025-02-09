import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";
import type { UserCredentials } from "../../lib/types";

const backend = ref(null);
export const useBackend = () => {
  const url = "http://localhost:8787/api";
  const localCredentials = useLocalStorage<UserCredentials>("@credentials", {
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
  });

  const getAuthHeader = () => {
    if (localCredentials && localCredentials.value.accessToken) {
      return { Authorization: "Bearer " + localCredentials.value.accessToken };
    }
  };

  return {
    backend,
    login: async (email: string, password: string) => {
      console.log(
        JSON.stringify({
          email: email,
          password: password,
        }),
      );
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      const credentials = (await response.json()) as UserCredentials;

      localCredentials.value = credentials;

      return credentials;
    },
  };
};
