import type { UserCredentials } from "../../lib/types";
import { useLocalStorage } from "@vueuse/core";

import { reactive } from "vue";

const localCredentials = reactive(
  useLocalStorage<UserCredentials>("@credentials", {
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
  }),
);

const API_URL : string = import.meta.env.VITE_API_URL ;

export const useAuth = () => {
  const getAuthHeader = () => {
    console.log(localCredentials);
    if (localCredentials && localCredentials.value.accessToken) {
      return { Authorization: "Bearer " + localCredentials.value.accessToken };
    }
  };

  return {
    credentials: localCredentials,
    getAuthHeader,
    login: async (email: string, password: string) => {
      try {
        console.log(email, password);
        const response = await fetch(`${API_URL}/auth/login`, {
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
        const credentials = (await response.json()) as UserCredentials & {
          status: string;
          message:string;
        };
        console.log(credentials);
        if (credentials.status == "ok") {
          console.log("ok");
          localCredentials.value = credentials;
        }
        console.log(credentials);
        return credentials;
      } catch (err) {
        console.log("[Error : Auth]", err);
      }
    },
    signUp: async (name:string,email: string, password: string) => {
      try {
        console.log(email, password);
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: "POST",
          body: JSON.stringify({
            name:name,
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json"
          },
        });
        const credentials = (await response.json()) as UserCredentials & {
          status: string;
          message:string
        };
        if (credentials.status == "ok") {
          console.log("ok");
          localCredentials.value = credentials;
        }
        return credentials;
      } catch (err) {
        console.log("[Error : Auth]", err);
      }
    },
    signOut:async ()=>{
      localCredentials.value = null
    }
  };
};
