import React from "react";
import { Box, Typography } from "@mui/material";

export interface Post {
  _id: string;
  title: string;
  content: string;
  sender: string;
  imageUrl?: string;
}

interface PostDetailsProps {
  post: Post;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      {post.imageUrl && (
        <Box mb={2}>
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </Box>
      )}
      <Typography variant="body1">{post.content}</Typography>
      <Typography variant="caption" color="textSecondary">
        By: {post.sender}
      </Typography>
    </Box>
  );
};

export default PostDetails;
