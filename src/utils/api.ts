import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../hooks/auth';

export const useAxiosWithAuth = () => {
  const { token } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [token]);

  return axiosInstance;
};
