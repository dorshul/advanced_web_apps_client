import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/axios";

export const uploadImage = async (img: File) => {
  const formData = new FormData();
  formData.append("file", img);
  const { data } = await axiosInstance.post(
    `/api/files?file=${img.name}`,
    formData,
    {
      headers: {
        "Content-Type": "image/*",
      },
    }
  );

  return data;
};

export const useUploadFile = (img: File) => {
  return useMutation({
    mutationFn: () => uploadImage(img),
  });
};
