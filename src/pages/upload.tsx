import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, Stack, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import PostPreview from "../components/posts/post-preview";
import { useCreatePost } from "../hooks/posts";

const UploadPostPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: undefined,
      content: undefined,
      img: undefined,
    },
  });

  const { mutateAsync: createPost, isPending } = useCreatePost();
  const watchedTitle = watch("title");
  const watchedContent = watch("content");
  const [error, setError] = useState("");

  const [preview, setPreview] = useState<string | null>(null);
  const [useAISuggestion, setUseAISuggestion] = useState(true);

  const previewPost = useMemo(() => {
    return {
      title: watchedTitle || "Post Title",
      content: watchedContent || "Your post content will be previewed here.",
    };
  }, [watchedTitle, watchedContent]);

  const onSubmit = async (data: {
    title?: string;
    img?: File;
    content?: string;
  }) => {
    setError("");
    try {
      await createPost({ post: { content: data.content, title: data.title }, img: data.img!, useAISuggestion });
      reset();
      navigate("/explore");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setError("Failed to upload post");
    }
  };

  return (
    <>
      <Stack direction="row" spacing={4} sx={{ p: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create Post
          </Typography>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Controller
            name="img"
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
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <label htmlFor="image-upload">
                  <IconButton component="span">
                    <AddPhotoAlternateIcon/>
                  </IconButton>
                </label>
              </div>
            )}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={useAISuggestion} 
                onChange={(e) => setUseAISuggestion(e.target.checked)}
              />
            }
            label="Use AI Suggestions"
          />
          {!useAISuggestion && <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                fullWidth
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : " "}
              />
            )}
          />}
          {!useAISuggestion && <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Content"
                variant="outlined"
                fullWidth
                rows={4}
                error={!!errors.content}
                helperText={errors.content ? errors.content.message : " "}
              />
            )}
          />}
          { isPending ? 
            <Typography>Uploading...</Typography> 
              : 
            <Button type="submit" variant="contained" disabled={isPending}>Upload Post</Button> 
          }
        </Box>
        <Box sx={{ flex: 1, maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom>
            Post Preview
          </Typography>
          <PostPreview
            post={{ ...previewPost, imageUrl: preview || "", _id: "", likes: 0 }}
            disabled={true}
          />
        </Box>
      </Stack>
    </>
  );
};

export default UploadPostPage;
