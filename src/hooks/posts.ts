import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/axios";
import Post from "../types/posts";
import { useUser } from "./user";

export const fetchPosts = async (query: Partial<Post>): Promise<Post[]> => {
  const { data } = await axiosInstance.get("/api/posts", {
    params: query,
    withCredentials: false,
  });
  return data;
};

export const fetchPost = async (id: string): Promise<Post> => {
  const { data } = await axiosInstance.get(`/api/posts/${id}`);
  return data;
};

export const usePosts = (query: Partial<Post>) => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(query),
  });
};

export const usePost = (id: string) => {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  });
};

export const createPost = async (post: Partial<Post>) => {
  const { data } = await axiosInstance.post("/api/posts", post);
  return data;
};

export const getImageSuggestion = async (imageUrl: string) => {
  const { data } = await axiosInstance.post<Suggestions | undefined>(
    "/api/posts/image",
    { imageUrl }
  );

  return data;
};

export const useCreatePost = () => {
  const { user } = useUser();
  if (!user) throw new Error("No User !");

  return useMutation({
    mutationKey: ["createPost"],
    mutationFn: (post: Partial<Post>) =>
      createPost({ ...post, sender: user._id }),
  });
};
interface Suggestions {
  title: string;
  content: string;
}

export const useGetPostSuggestions = (imageUrl: string | null) => {
  return useQuery({
    queryKey: ["postSuggestions", imageUrl],
    queryFn: () =>
      imageUrl ? getImageSuggestion(imageUrl) : Promise.resolve(undefined),
    enabled: !!imageUrl,
  });
};
