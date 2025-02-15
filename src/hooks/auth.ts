import { useContext } from "react";
import AuthContext from "../contexts/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axios.post<{ token: string }>(
        "/api/auth/login",
        credentials
      );
      return data.token;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: {
      name: string;
      email: string;
      password: string;
    }) => {
      const { data } = await axios.post<{ token: string }>(
        "/api/auth/register",
        credentials
      );
      return data.token;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
  });
};
