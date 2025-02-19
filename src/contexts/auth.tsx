import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface User {
  name: string;
  email: string;
  _id: string;
}

interface AuthContextType {
  user: User | null | undefined;
  token: string | null;
  login: (accessToken: string, refreshToken: string, userId: string) => void;
  logout: () => void;
  refresh: () => Promise<string | undefined>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const userId = Cookies.get('userId');

  const { data: fetchedUser, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token || !userId) return null;
      const response = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      return response.data;
    },
    enabled: !!token && !!userId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  const login = (accessToken: string, refreshToken: string, userId: string) => {
    Cookies.set('userId', userId);
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
    queryClient.invalidateQueries({ queryKey: ['user'] });
    setToken(accessToken);
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    Cookies.remove('refreshToken');
    Cookies.remove('userId');
    Cookies.remove('accessToken');
    queryClient.setQueryData(['user'], null);
  }, [queryClient]);

  const refresh = useCallback(async (): Promise<string | undefined> => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      const response = await axios.post<{
        accessToken: string;
        refreshToken: string;
      }>('/api/auth/refresh', { refreshToken }, { withCredentials: true });
      const newAccessToken = response.data.accessToken;
      Cookies.set('refreshToken', response.data.refreshToken, {
        expires: 1 / 24,
      });
      setToken(newAccessToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      return newAccessToken;
    } catch (error) {
      logout();
      return undefined;
    }
  }, [logout, queryClient]);

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        refresh();
      }, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [refresh, token]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refresh, isLoading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
