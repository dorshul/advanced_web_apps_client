import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "../services/axios";
import { uploadImage } from "./files";

interface User {
  _id: string;
  email: string;
  name: string;
  imageUrl: string;
}

interface UpdateUserData {
  _id?: string;
  name?: string;
  avatarUrl?: File;
}

export const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get<User>("/api/users/me");
      return data;
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: UpdateUserData) => {
      const { url } = await uploadImage(updateData.avatarUrl!);
      const { data } = await axios.put<User>(`/api/users/${user?._id}`, {
        ...updateData,
        avatarUrl: url,
      });
      return data;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["user"], newUser);
    },
  });

  return {
    user,
    isLoading,
    error,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
