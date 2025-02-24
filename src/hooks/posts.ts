import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/axios";
import Post from "../types/posts";
import { useUser } from "./user";
import { uploadImage } from "./files";

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

export const createPost = async (post: Partial<Post>, img: File) => {
  const uploadImageData = await uploadImage(img);
  const updatedPost = {
    ...post,
    imageUrl: uploadImageData.url,
  };
  const { data } = await axiosInstance.post("/api/posts", updatedPost);
  return data;
};

export const useCreatePost = () => {
  const { user } = useUser();
  if (!user) throw new Error("No User !");

  return useMutation({
    mutationKey: ["createPost"],
    mutationFn: ({
      post,
      img,
    }: {
      post: Partial<Post>;
      img: File;
      useAISuggestion?: boolean;
    }) => createPost({ ...post, sender: user._id }, img),
  });
};
