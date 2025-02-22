import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./auth";
import axios from "axios";

export interface Like {
  _id: string;
  sender: string;
  content: string;
  postId: string;
}

export const addLike = async (token: string, postId: string): Promise<Like> => {
  const { data } = await axios.put(
    `/api/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const useAddLike = (postId: string) => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  if (!token) throw new Error("Token is not defined");
  if (!user) throw new Error("User is not defined");

  return useMutation({
    mutationFn: () => addLike(token, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
