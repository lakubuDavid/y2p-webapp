import type { ApiResponse, } from "../../lib/types";
import { useSessionStorage } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies.mjs";
//

import { useRouter } from "vue-router";
import type { User, UserCredentials } from "../models/user";

export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

// const sessionStorage = useSessionStorage<UserCredentials>("_credntials", {
//   accessToken: undefined,
//   refreshToken: undefined,
//   user: undefined,
// });
const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "https://api.y2p.lakubudavid.me/api"

export type SignupResult = UserCredentials & {
  status?: string;
  message?: string;
  error?: any;
};

export const useAuth = () => {
  // const credentials = ref<UserCredentials | null>()

  const cookies = useCookies(["__token", "__refresh_token"]);
  const sessionStorage = useSessionStorage<
    UserCredentials & { tokenExpiresAt?: number }
  >("_credentials", {
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
    tokenExpiresAt: undefined, // Stores token expiry timestamp
  });

  // Check if access token is expired
  const isTokenExpired = () => {
    // console.log(sessionStorage.value)
    console.log("checking if expired");
    if (!sessionStorage.value.tokenExpiresAt) return true;
    console.log("checking expiation date");
    const result = Date.now() > sessionStorage.value.tokenExpiresAt;
    return result;
  };

  // Refresh token function
  const refreshToken = async () => {
    // if (!sessionStorage.value.refreshToken) return false;
    console.log("refreshing");
    // const toast = useToast();
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: sessionStorage.value.refreshToken,
        }),
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status == 401) {
          sessionStorage.value = {
            accessToken: undefined,
            refreshToken: undefined,
            user: undefined,
            tokenExpiresAt: undefined,
          };
        }
        // const toast = useToast();
        // toast.add({ severity: "error", summary: "Session expired" });
        useRouter().push("/login");
        throw new Error("Token refresh failed");
      }

      const newTokens = (await response.json()) as UserCredentials;
      sessionStorage.value = {
        ...sessionStorage.value,
        accessToken: newTokens.accessToken,
        tokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
      };

      // cookies.set("__token", newTokens.accessToken, {
      //   expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRY),
      // });

      return true;
    } catch (err) {
      console.error("[Error: Auth] Token refresh failed", err);

      // const toast = useToast();
      // toast.add({ severity: "error", summary: "Session error" });
      useRouter().push("/login");
      return false;
    }
  };
  const getAuthHeader = async () => {
    if (isTokenExpired()) {
      console.log("expired");
      const refreshed = await refreshToken();
      if (!refreshed) {
        return { Authorization: "" };
      }
    }
    return { Authorization: `Bearer ${sessionStorage.value.accessToken}` };
  };
  // Periodically refresh token in the background
  // let refreshInterval: number | undefined;

  // const _startAutoRefresh = () => {
  //   stopAutoRefresh();
  //   refreshInterval = window.setInterval(
  //     async () => {
  //       if (isTokenExpired()) {
  //         await refreshToken();
  //       }
  //     },
  //     5 * 60 * 1000,
  //   ); // Refresh every 5 minutes
  // };

  // const stopAutoRefresh = () => {
  //   if (refreshInterval) {
  //     clearInterval(refreshInterval);
  //     refreshInterval = undefined;
  //   }
  // };

  if (isTokenExpired()) {
    refreshToken();
  }
  // onMounted(startAutoRefresh);
  // onUnmounted(stopAutoRefresh);
  return {
    credentials: sessionStorage,
    getAuthHeader,
    refreshToken,
    isTokenExpired,
    login: async (
      email: string,
      password: string,
    ): Promise<ApiResponse<User | undefined>> => {
      try {
        const url = `${API_URL}/auth/login`;

        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `${API_URL}`,
            ...(await getAuthHeader()),
          },
          mode: "cors",
          credentials: "include",
        });

        const {
          data: credentials,
          status,
          error,
        } = (await response.json()) as ApiResponse<User>;
        // console.log("cred", credentials, error);

        if (error) {
          return { error, data: undefined };
        }

        if (status == "ok") {
          // console.log("ok");
          sessionStorage.value = {
            // accessToken: credentials.accessToken,
            // refreshToken: credentials.refreshToken,
            user: credentials,
            tokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
          };
          // startAutoRefresh();
        }
        return { data: credentials };
      } catch (err) {
        console.log("[Error : Auth]", err);
        return { error: err as Error, data: undefined };
      }
    },
    signUp: async (name: string, email: string, password: string)   => {
      try {
        // console.log(email, password);
        const url = `${API_URL}/auth/signup`;
        // console.log(url);
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `${API_URL}`,
          },
          mode: "cors",
          credentials: "include",
        });
        const result = (await response.json()) as SignupResult
        if (result.status !== "ok") {
          console.error("[Error: Auth] Signup failed", result.message);
          return { error: result.message || "Signup failed" };
        }

        // Auto-login user after signup
        sessionStorage.value = {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
          tokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
        };
        // Start auto-refresh
        // startAutoRefresh();
        return result;
      } catch (err) {
        console.log("[Error : Auth]", err);
      }
    },
    signOut: async () => {
      try {
        const response = await fetch(`${API_URL}/auth/protected/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await getAuthHeader()),
          },
          mode: "cors",
          credentials: "include",
        });

        sessionStorage.value = {
          accessToken: undefined,
          refreshToken: undefined,
          user: undefined,
          tokenExpiresAt: undefined,
        };
        cookies.remove("__token");
        cookies.remove("__refresh_token");

        // if (!response.ok) throw new Error("Logout failed");
        // stopAutoRefresh();

        return response;
      } catch (err) {
        console.error("[Error: Auth] Logout failed", err);
      }
    },
  };
};
