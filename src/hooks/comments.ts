import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosWithAuth as api } from '../utils/api';
import { useAuth } from './auth';
import { User } from '../contexts/auth';
import axios from 'axios';

export interface Comment {
  _id: string;
  sender: string;
  content: string;
  postId: string;
}

export const fetchComments = async (
  token: string,
  postId: string
): Promise<Comment[]> => {
  const { data } = await axios.get(`/api/comments?postId=${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data || [];
};

export const addComment = async (
  token: string,
  commentData: { postId: string; content: string },
  user: User
): Promise<Comment> => {
  const { data } = await axios.post(
    '/api/comments',
    {
      ...commentData,
      sender: user.email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const useComments = (postId: string) => {
  const { token } = useAuth();
  if (!token) throw new Error('Token is not defined');

  return useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(token, postId),
    enabled: !!postId,
  });
};

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  if (!token) throw new Error('Token is not defined');

  if (!user) throw new Error('User is not defined');

  return useMutation({
    mutationFn: (content: string) =>
      addComment(token, { postId, content }, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};
