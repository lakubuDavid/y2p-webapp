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

// const API_URL = import.meta.env.VITE_API_URL ;
const API_URL = "https://api.y2p.lakubudavid.me/api"
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
        const url = `${API_URL}/auth/login`
        console.log(url)
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          mode:"cors"
        });
        const credentials = (await response.json()) as UserCredentials & {
          status: string;
          message:string;
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
    signUp: async (name:string,email: string, password: string) => {
      try {
        console.log(email, password);
        const url = `${API_URL}/auth/signup`
        console.log(url)
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            name:name,
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json"
          },
          mode:"cors"
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
