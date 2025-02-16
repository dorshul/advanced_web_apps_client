// src/components/CommentsList.tsx
import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Comment } from "../../hooks/comments";

interface CommentsListProps {
  comments: Comment[] | [];
  isLoading: boolean;
  error: unknown;
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  isLoading,
  error,
}) => {
  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error loading comments.</Typography>;
  if (!comments || comments.length === 0)
    return <Typography>No comments yet.</Typography>;
  console.log(comments);
  return (
    <Box>
      {comments.map((comment) => (
        <Box
          key={comment._id}
          border={1}
          borderRadius={2}
          p={1}
          mt={1}
          borderColor="grey.300"
        >
          <Typography variant="subtitle2">{comment.sender}</Typography>
          <Typography variant="body2">{comment.content}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CommentsList;
