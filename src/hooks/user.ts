import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "../services/axios";
import { uploadImage } from "./files";
import { useAuth } from "../contexts/auth";
import { User } from "../types/user";

interface UpdateUserData {
  _id?: string;
  name?: string;
  avatarUrl?: File;
}

export const useUser = () => {
  const queryClient = useQueryClient();
  const { isAuth } = useAuth();

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
    enabled: isAuth,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: UpdateUserData) => {
      const url = updateData.avatarUrl
        ? (await uploadImage(updateData.avatarUrl)).url
        : user?.avatarUrl;
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
