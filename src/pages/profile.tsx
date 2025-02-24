import { Box } from "@mui/material";

import UserDetails from "../components/user-details";
import PostList from "../components/posts/posts-list";
import { useUser } from "../hooks/user";
import { usePosts } from "../hooks/posts";

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const { data: posts } = usePosts({ sender: user?._id });

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <UserDetails />
      <PostList posts={posts || []} />
    </Box>
  );
};

export default ProfilePage;
