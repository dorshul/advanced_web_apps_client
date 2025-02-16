// src/components/AddComment.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAddComment } from "../../hooks/comments";
import { useAuth } from "../../hooks/auth";

interface AddCommentProps {
  postId: string;
}

const AddComment: React.FC<AddCommentProps> = ({ postId }) => {
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const addCommentMutation = useAddComment(postId);

  const handleSubmit = () => {
    if (!commentText.trim() || !user) return;
    addCommentMutation.mutate({
      postId,
      content: commentText,
      sender: user.name,
    });
    setCommentText("");
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Add a Comment
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        variant="outlined"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here..."
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={addCommentMutation.isPending || commentText.trim() === ""}
      >
        {addCommentMutation.isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Submit Comment"
        )}
      </Button>
    </Box>
  );
};

export default AddComment;
