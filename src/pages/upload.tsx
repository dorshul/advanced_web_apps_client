import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import PostPreview from "../components/posts/post-preview";
import { useCreatePost, useGetPostSuggestions } from "../hooks/posts";

const UploadPostPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      imageUrl: "",
      content: "",
    },
  });

  const { mutateAsync: createPost, isPending } = useCreatePost();
  const watchedTitle = watch("title");
  const watchedImageUrl = watch("imageUrl");
  const watchedContent = watch("content");
  const [error, setError] = useState("");
  const [suggestionImageUrl, setSuggestionImageUrl] = useState<string | null>(
    null
  );

  const {
    data: suggestions,
    refetch: fetchSuggestions,
    isLoading,
  } = useGetPostSuggestions(suggestionImageUrl);

  useEffect(() => {
    console.log(suggestions);
    if (suggestions) {
      setValue("title", suggestions["title"]);
      setValue("content", suggestions["content"]);
    }
  }, [suggestions, setValue]);

  const previewPost = useMemo(() => {
    return {
      title: watchedTitle || "Post Title",
      content: watchedContent || "Your post content will be previewed here.",
      imageUrl:
        watchedImageUrl ||
        "https://via.placeholder.com/300x300?text=Image+Preview",
    };
  }, [watchedTitle, watchedImageUrl, watchedContent]);

  const onSubmit = async (data: {
    title: string;
    imageUrl: string;
    content: string;
  }) => {
    setError("");
    try {
      await createPost(data);
      reset();
      navigate("/posts");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setError("Failed to upload post");
    }
  };

  const handleAISuggestions = () => {
    if (!watchedImageUrl) setError("Image URL is required");
    else {
      setSuggestionImageUrl(watchedImageUrl);
      fetchSuggestions();
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
          />
          <Controller
            name="imageUrl"
            control={control}
            rules={{ required: "Image URL is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image URL"
                variant="outlined"
                fullWidth
                error={!!errors.imageUrl}
                helperText={errors.imageUrl ? errors.imageUrl.message : " "}
              />
            )}
          />
          <Controller
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
          />
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Uploading..." : "Upload Post"}
          </Button>
          {/* TODO - Add tooltip with explanation */}
          <Button
            type="button"
            variant="contained"
            disabled={isPending}
            onClick={handleAISuggestions}
          >
            {isLoading ? "Uploading..." : "AI Suggestions"}
          </Button>
        </Box>
        <Box sx={{ flex: 1, maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom>
            Post Preview
          </Typography>
          <PostPreview
            post={{ ...previewPost, _id: "", likes: 0 }}
            disabled={true}
          />
        </Box>
      </Stack>
    </>
  );
};

export default UploadPostPage;
