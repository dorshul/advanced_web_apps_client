import React, { createContext, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: string;
  username: string;
  profilePicture: string;
}

interface AuthContextType {
  user: User | null | undefined;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
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

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) return null;
      const response = await axios.get("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    queryClient.invalidateQueries({ queryKey: ["user"] }); // Refetch user data
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    queryClient.setQueryData(["user"], null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
