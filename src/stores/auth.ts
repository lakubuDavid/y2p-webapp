// src/stores/auth.ts
import { defineStore } from "pinia";
import { computed } from "vue";
import { useSessionStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import type { User } from "../models/user";
import { api } from "@lib/client";

// Constants
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

// Types
export type UserCredentials = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

export type UserCredentials2 = {
  accessToken?: string;
  refreshToken?: string;
  data?: User;
};

export type SignupResult = UserCredentials & {
  status?: string;
  message?: string;
  error?: any;
};

export type ApiResponse<T> = {
  data?: T;
  error?: any;
};

export const useAuthStore = defineStore("auth", () => {
  // State
  const sessionStorage = useSessionStorage<
    UserCredentials & { tokenExpiresAt?: number }
  >("_credentials", {
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
    tokenExpiresAt: undefined,
  });

  // Computed
  const isAuthenticated = computed(() => !!sessionStorage.value.accessToken);
  const user = computed(() => sessionStorage.value.user);

  // Check if access token is expired
  const isTokenExpired = () => {
    if (!sessionStorage.value.tokenExpiresAt) return true;
    return Date.now() > sessionStorage.value.tokenExpiresAt;
  };

  // Refresh token function
  const refreshToken = async () => {
    console.log("refreshing token");

    if (!sessionStorage.value.refreshToken) {
      return false;
    }

    try {
      const response = await api.post("/auth/refresh", {
        refreshToken: sessionStorage.value.refreshToken,
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = response.data as UserCredentials;

      // Update tokens in session storage
      sessionStorage.value = {
        ...sessionStorage.value,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
      };

      return true;
    } catch (err) {
      console.error("[Error: Auth] Token refresh failed", err);

      const router = useRouter();
      router.push("/login");
      return false;
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string,
  ): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.ok && response.data) {
        // Store credentials in session storage
        const data = response.data as UserCredentials2;
        sessionStorage.value = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.data,
          tokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
        };

        return { data: data.data };
      } else {
        return { error: (response.data as any)?.error || response.problem };
      }
    } catch (err) {
      console.error("[Error: Auth]", err);
      return { error: err };
    }
  };

  // Sign up function
  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<SignupResult> => {
    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      if (!response.ok) {
        return {
          status: "error",
          message: (response.data as any)?.message || "Signup failed",
          error: (response.data as any)?.error || response.problem,
        };
      }

      const result = response.data as any;

      // Auto-login user after signup
      sessionStorage.value = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.data,
        tokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
      };

      return result;
    } catch (err) {
      console.log("[Error : Auth]", err);
      return { status: "error", error: err };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const response = await api.post("/auth/protected/logout");

      // Clear session data regardless of server response
      sessionStorage.value = {
        accessToken: undefined,
        refreshToken: undefined,
        user: undefined,
        tokenExpiresAt: undefined,
      };

      return response.ok;
    } catch (err) {
      console.error("[Error: Auth] Signout failed", err);

      // Still clear local session data even if server request fails
      sessionStorage.value = {
        accessToken: undefined,
        refreshToken: undefined,
        user: undefined,
        tokenExpiresAt: undefined,
      };

      return false;
    }
  };

  // Check and refresh token on store initialization if needed
  if (isTokenExpired() && sessionStorage.value.refreshToken) {
    refreshToken();
  }

  return {
    // State exports
    credentials: sessionStorage,

    // Computed exports
    isAuthenticated,
    user,

    // Methods
    isTokenExpired,
    refreshToken,
    login,
    signUp,
    signOut,
  };
});
