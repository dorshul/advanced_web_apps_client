import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import type { CredentialResponse } from "@react-oauth/google";

import { axiosInstance } from "../services/axios.ts";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isAuth, setIsAuth] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axiosInstance.post(
            "/api/auth/refresh",
            { refreshToken },
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          localStorage.setItem("refreshToken", data.refreshToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          setIsAuth(true);
          queryClient.setQueryData(["user"], data.user);
        } catch (error) {
          localStorage.removeItem("refreshToken");
          setIsAuth(false);
        }
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [queryClient]);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const { data } = await axiosInstance.post(
              "/api/auth/refresh",
              { refreshToken },
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );

            localStorage.setItem("refreshToken", data.refreshToken);
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${data.accessToken}`;

            return axiosInstance(error.config);
          } catch (refreshError) {
            localStorage.removeItem("refreshToken");
            setIsAuth(false);
            queryClient.setQueryData(["user"], null);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axiosInstance.post("/api/auth/login", credentials);

      localStorage.setItem("refreshToken", data.refreshToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      return data;
    },
    onSuccess: (data) => {
      setIsAuth(true);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await axiosInstance.post(
        "/api/auth/register",
        credentials
      );

      localStorage.setItem("refreshToken", data.refreshToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: async (credentials: CredentialResponse) => {
      const { data } = await axiosInstance.post(
        "/api/auth/google",
        credentials
      );

      localStorage.setItem("refreshToken", data.refreshToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await axiosInstance.post("/api/auth/logout", {
        refreshToken,
      });

      localStorage.removeItem("refreshToken");
      axiosInstance.defaults.headers.common["Authorization"] = "";

      return response;
    },
    onSuccess: () => {
      setIsAuth(false);
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      localStorage.removeItem("refreshToken");
      axiosInstance.defaults.headers.common["Authorization"] = "";
      setIsAuth(false);
    },
  });

  return {
    isAuth,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    googleSignIn: googleAuthMutation.mutateAsync,
    isLoading:
      isCheckingAuth ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error || registerMutation.error || logoutMutation.error,
  };
};
