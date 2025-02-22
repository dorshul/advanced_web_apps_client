import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "../types/posts";
import { useAuth } from "./auth";

export const fetchPosts = async (query: Partial<Post>): Promise<Post[]> => {
  const { data } = await axios.get("/api/posts", {
    params: query,
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

export const usePosts = (query: Partial<Post>) => {
  const { token } = useAuth();
  if (!token) throw new Error("No Auth !");

  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(query),
  });
};

export const usePost = (id: string) => {
  const { token } = useAuth();
  if (!token) throw new Error("No Auth !");

  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(token, id),
  });
};

export const createPost = async (token: string, post: Partial<Post>) => {
  const { data } = await axios.post("/api/posts", post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getImageSuggestion = async (token: string, imageUrl: string) => {
  const { data } = await axios.post<Suggestions | undefined>(
    "/api/posts/image",
    { imageUrl },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const useCreatePost = () => {
  const { token, user } = useAuth();
  if (!token) throw new Error("No Auth !");
  if (!user) throw new Error("No User !");

  return useMutation({
    mutationKey: ["createPost"],
    mutationFn: (post: Partial<Post>) =>
      createPost(token, { ...post, sender: user._id }),
  });
};
interface Suggestions {
  title: string;
  content: string;
}

export const useGetPostSuggestions = (imageUrl: string | null) => {
  const { token } = useAuth();
  if (!token) throw new Error("No Auth !");

  return useQuery({
    queryKey: ["postSuggestions", imageUrl],
    queryFn: () =>
      imageUrl
        ? getImageSuggestion(token, imageUrl)
        : Promise.resolve(undefined),
    enabled: !!imageUrl,
  });
};
