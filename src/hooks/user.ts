import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from './auth';
import { User } from '../contexts/auth';

export const fetchUser = async (
  token: string,
  userId: string
): Promise<User> => {
  const { data } = await axios.get(`/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateUser = async (
  token: string,
  userData: Partial<User>
): Promise<User> => {
  const { data } = await axios.put(`/api/users/${userData._id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const useUser = () => {
  const { token, user } = useAuth();
  if (!token) throw new Error('No auth token available');
  if (!user) throw new Error('No user available');

  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => fetchUser(token, user._id),
  });
};

export const useUpdateUser = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  if (!token) throw new Error('No auth token available');
  if (!user) throw new Error('No user token available');

  return useMutation({
    mutationFn: (data: Partial<User>) => updateUser(token, data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });
};
