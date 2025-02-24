import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useDeletePost, usePost } from "../hooks/posts";
import Post from "../components/posts/post-details";
import { useUser } from "../hooks/user";

const PostDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutateAsync: deletePostMutation } = useDeletePost()
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No id");

  const { data: post, isLoading, error } = usePost(id);

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  const isLoggedInUser = post.sender === user?._id

  const handleDelete = async () => {
    deletePostMutation(post._id)
    navigate("/explore")
  }

  const handleEdit = async () => {
    navigate(`/posts/edit/${post._id}`)
  }

  return (
    <Stack direction="column" alignItems="center" spacing={2}>
      <Post post={post} />
      { isLoggedInUser && <Stack direction="row" spacing={2}>
        <IconButton onClick={handleDelete}><DeleteIcon color="error"/></IconButton>
        <IconButton onClick={handleEdit}><EditIcon  color="info"/></IconButton>
      </Stack>}
    </Stack>
  );
};

export default PostDetailsPage;
