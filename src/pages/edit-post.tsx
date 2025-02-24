import React from "react";
import { useParams } from "react-router-dom";

import PostForm from "../components/posts/post-form";
import { usePost } from "../hooks/posts";

const UploadPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No id");
  const { data: post, isLoading, error } = usePost(id);
  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <PostForm existingPost={{ content: post.content, title: post.title, imageUrl: post.imageUrl, id }}/>
  );
};

export default UploadPostPage;
