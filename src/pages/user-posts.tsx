import React from "react";
import { usePosts } from "../hooks/posts";
import Post from "../components/post";
import { useUser } from "../hooks/user";

const UserPostsView: React.FC = () => {
  const { user } = useUser();
  const {
    data: userPosts,
    isLoading: isLoadingPosts,
    isError,
  } = usePosts({
    sender: user?._id,
  });
  if (isLoadingPosts) return <p>Loading posts...</p>;
  if (isError) return <p>Error loading posts</p>;

  return (
    <div>
      {userPosts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default UserPostsView;
