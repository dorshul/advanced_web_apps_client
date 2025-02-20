import { Box } from '@mui/material';

import { useUser } from '../hooks/user';
import PostList from '../components/posts-list';
import { usePosts } from '../hooks/posts';
import UserDetails from '../components/user-details';

const ProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useUser();
  const { data: userPosts, isLoading: isLoadingPosts } = usePosts({ sender: profile?._id });

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <Box
      sx={{
        textAlign: 'center',
        padding: '20px',
      }}
    >
      {!isLoading && <UserDetails/>}
      {!isLoadingPosts && <PostList posts={userPosts || []} />}
    </Box>
  );
};

export default ProfilePage;
