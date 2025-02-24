import React from "react";
import { useParams } from "react-router-dom";
import { usePost } from "../hooks/posts";
import Post from "../components/posts/post-details";

const PostDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No id");

  const { data: post, isLoading, error } = usePost(id);

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  return <Post post={post} />;
};

export default PostDetailsPage;
