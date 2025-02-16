import React, { createContext, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null | undefined;
  login: (token: string, email: string) => void;
  logout: () => void;
  isLoading: boolean;
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [email, setEmail] = useState<string | null>(null);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("hello");
      if (!token) return null;
      const response = await axios.get("/api/users", {
        params: { email },
      });
      return response.data;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = (newToken: string, email: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setEmail(email);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setEmail(null);
    queryClient.setQueryData(["user"], null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
