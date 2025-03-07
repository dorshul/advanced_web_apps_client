import { Stack } from "@mui/material";

import type Post from "../../types/posts";
import PostPreview from "./post-preview";

interface PostListProps {
  posts: Post[];
}

const PostList = ({ posts }: PostListProps) => {
  return (
    <Stack direction="row" flexWrap="wrap" justifyContent={"center"} gap={2}>
      {posts.map((post) => (
        <PostPreview key={post._id} post={post} />
      ))}
    </Stack>
  );
};

export default PostList;
