import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import PostDetails from "../components/post-details";
import CommentsList from "../components/comments/comments-list";
import AddComment from "../components/comments/add-comment";
import { usePost } from "../hooks/posts";
import { useComments } from "../hooks/comments";

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading: postLoading, error: postError } = usePost(id!);

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useComments(id!);

  if (postLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (postError || !post) {
    return (
      <Typography variant="h6" color="error">
        Error loading post.
      </Typography>
    );
  }

  return (
    <Box p={2}>
      <PostDetails post={post} />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <CommentsList
          comments={comments || []}
          isLoading={commentsLoading}
          error={commentsError}
        />
      </Box>
      <AddComment postId={id!} />
    </Box>
  );
};

export default PostView;
