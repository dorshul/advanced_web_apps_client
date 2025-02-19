import { useContext } from 'react';
import AuthContext from '../contexts/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await axios.post<{
        accessToken: string;
        refreshToken: string;
        _id: string;
      }>('/api/auth/login', credentials);
      return {
        token: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data._id,
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
      const { data } = await axios.post('/api/auth/register', credentials);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
    },
  });
};
