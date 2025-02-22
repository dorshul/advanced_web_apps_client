import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  email: string;
  password: string;
}

import { axiosInstance } from "../services/axios.ts";
import { useEffect } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const { data } = await axios.post(
              "/api/auth/refresh",
              {},
              {
                withCredentials: true,
              }
            );
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${data.accessToken}`;
            return axiosInstance(error.config);
          } catch {
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
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
    },
  });
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await axios.post("/api/auth/register", credentials, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error || registerMutation.error || logoutMutation.error,
  };
};
