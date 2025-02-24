import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "../services/axios";
import { useAuth } from "../contexts/auth";

interface User {
  _id: string;
  email: string;
  name: string;
  imageUrl: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
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
      const { data } = await axios.patch<User>("/api/users/me", updateData);
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
