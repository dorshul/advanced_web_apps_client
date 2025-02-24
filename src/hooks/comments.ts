import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "../services/axios";
import { useUser } from "./user";

export interface Comment {
  _id: string;
  sender: string;
  content: string;
  postId: string;
}

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const { data } = await axios.get(`/api/comments?postId=${postId}`);
  return data || [];
};

export const addComment = async (
  commentData: {
    postId: string;
    content: string;
  },
  user: { email: string }
): Promise<Comment> => {
  const { data } = await axios.post("/api/comments", {
    ...commentData,
    sender: user.email,
  });
  return data;
};

export const useComments = (postId: string) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId && postId !== "",
  });
};

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (content: string) =>
      addComment({ postId, content }, { email: user!.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};
