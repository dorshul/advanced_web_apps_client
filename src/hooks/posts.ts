import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Post } from "../components/post-details"; // Ensure that Post is exported from this file

export const fetchPost = async (postId: string): Promise<Post> => {
  const { data } = await axios.get(`/api/posts/${postId}`);
  return data;
};

export const usePost = (postId: string) =>
  useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
  });
