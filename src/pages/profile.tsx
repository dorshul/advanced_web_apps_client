import { Box } from "@mui/material";

import UserDetails from "../components/user-details";
import UserPostsView from "./user-posts";

const ProfilePage: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <UserDetails />
      <UserPostsView />
    </Box>
  );
};

export default ProfilePage;
