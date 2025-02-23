import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import { useUser } from "../hooks/user";
import { Controller, useForm } from "react-hook-form";

const UserDetails: React.FC = () => {
  const { user, updateUser, isLoading } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarUrl = editMode ? avatarPreview || user?.imageUrl : user?.imageUrl;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name,
      avatarUrl: undefined,
    },
  });

  const onClickSave = async () => {
    await handleSubmit(onSubmit)()
    setEditMode(false);
  }

  const onSubmit = async (data: {
    name?: string;
    avatarUrl?: File;
  }) => {
    setError("");
    try {
      await updateUser(data);
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setError("Failed to upload post");
    }
  };

  if (isLoading) return <div>Loading User...</div>;

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Avatar
        src={avatarUrl}
        alt="User Avatar"
        sx={{
          width: "200px",
          height: "200px",
          margin: "0 auto",
        }}
      />
      {editMode ? (
        <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Controller
          name="avatarUrl"
          control={control}
          rules={{ required: "Image is required" }}
          render={({ field: { onChange } }) => (
            <div>
              <input
                type="file"
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                id="image-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <label htmlFor="image-upload">
                <IconButton component="span" sx={{ margin: "10px" }}>
                  <AddPhotoAlternateIcon/>
                </IconButton>
              </label>
            </div>
          )}
        />
        <Controller
          name="name"
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : " "}
            />
          )}
        />
      </Box>
      ) : (
        <Typography variant="h6" sx={{ margin: "10px" }}>
          {user?.name}
        </Typography>
      )}
      <Stack direction="row" justifyContent="center">
        <IconButton
          sx={{ margin: "10px" }}
          onClick={() => alert("Logged out!")}
        >
          {/* TODO Navigate on logout */}
          <LogoutIcon color="warning" />
        </IconButton>
        {editMode ? (
          <IconButton sx={{ margin: "10px" }} onClick={onClickSave}>
            <SaveIcon color="success" />
          </IconButton>
        ) : (
          <IconButton sx={{ margin: "10px" }} onClick={() => setEditMode(true)}>
            <EditIcon color="info" />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default UserDetails;
