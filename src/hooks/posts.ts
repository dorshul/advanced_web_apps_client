import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Post from '../types/posts';
import { useAuth } from './auth';

export const fetchPosts = async (token: string): Promise<Post[]> => {
  const { data } = await axios.get('/api/posts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const fetchPost = async (token: string, id: string): Promise<Post> => {
  const { data } = await axios.get(`/api/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const usePosts = () => {
  const { token } = useAuth();
  if (!token) throw new Error('No Auth !');

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(token),
  });
};

export const usePost = (id: string) => {
  const { token } = useAuth();
  if (!token) throw new Error('No Auth !');

  return useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => fetchPost(token, id),
  });
};
