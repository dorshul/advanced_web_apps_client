import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "../services/axios";

export interface Like {
  _id: string;
  sender: string;
  content: string;
  postId: string;
}

export const addLike = async (postId: string): Promise<Like> => {
  const { data } = await axios.put(`/api/posts/${postId}/like`);
  return data;
};

export const useAddLike = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
