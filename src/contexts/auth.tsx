import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
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
import { useEffect, useState } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const { data } = await axiosInstance.post(
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
      setIsAuth(true);
      queryClient.setQueryData(["user"], data.user);
    },
  });
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await axiosInstance.post(
        "/api/auth/register",
        credentials,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onSuccess: (data) => {
      setIsAuth(true);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 204) {
        axiosInstance.defaults.headers.common["Authorization"] = "";
      }

      return response;
    },
    onSuccess: () => {
      setIsAuth(false);
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return {
    isAuth,
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
