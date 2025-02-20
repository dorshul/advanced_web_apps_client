import React from 'react';
import { usePosts } from '../hooks/posts';
import Post from '../components/post';

const PostsView: React.FC = () => {
  const { data: posts, isLoading, error } = usePosts({});

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <div>
      <h1>Posts</h1>
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostsView;
