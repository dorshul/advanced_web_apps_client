import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const deletePost = async (id: string): Promise<Post> => {
  const { data } = await axiosInstance.delete(`/api/posts/${id}`);
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
    enabled: !!id,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId), // Call API
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh post list after deletion
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
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

export const updatePost = async (
  postId: string,
  post: Partial<Post>,
  img?: File
) => {
  let imageUrl;
  if (img) {
    const uploadImageData = await uploadImage(img);
    imageUrl = uploadImageData.url;
  }

  const updatedPost = {
    ...post,
    imageUrl,
  };

  const { data } = await axiosInstance.put(`/api/posts/${postId}`, updatedPost);
  return data;
};

export const useUpdatePost = () => {
  const { user } = useUser();
  if (!user) throw new Error("No User !");

  return useMutation({
    mutationKey: ["updatePost"],
    mutationFn: ({
      postId,
      post,
      img,
    }: {
      postId: string;
      post: Partial<Post>;
      img?: File;
    }) => updatePost(postId, { ...post, sender: user._id }, img),
  });
};
