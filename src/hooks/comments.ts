import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

export interface Comment {
  _id: string;
  sender: string;
  content: string;
  postId: string;
}

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const { data } = await axios.get(`/api/comments?postId=${postId}`);
  if (!data) return [];
  return data;
};

export const addComment = async (commentData: {
  postId: string;
  content: string;
  sender: string;
}): Promise<Comment> => {
  const token = localStorage.getItem("authToken");
  console.log(token);
  const { data } = await axios.post("/api/comments", commentData, {
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  });
  return data;
};

export const useComments = (postId: string) =>
  useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};
