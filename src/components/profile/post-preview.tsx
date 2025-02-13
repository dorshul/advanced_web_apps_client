import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Typography, CardContent, CardMedia, Card, Icon, IconButton, Stack } from '@mui/material';

import Post from '../types/Post';

type PostPreviewProps = {
  post: Post
}

const PostPreview = ({ post }: PostPreviewProps) => {
  const { title, content } = post;
  const imageUrl = "https://picsum.photos/200/300";
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = () => {
    setComments(comments + 1);
  };
  
  return (
    <Card sx={{ minWidth: 300, border: '1px solid rgb(163, 162, 165)', margin: 1 }}>
      <CardMedia
        sx={{ height: 300, width: 300 }}
        image={imageUrl}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </Typography>
      </CardContent>
      <Stack
        direction={'row'}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction={'row'} gap={1} alignItems={"center"} margin={1}>
          <IconButton disabled color="primary">
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2">{likes}</Typography>
        </Stack>

        <Stack direction={'row'} gap={1} alignItems={"center"} margin={1}>
          <IconButton disabled color="primary">
            <CommentIcon />
          </IconButton>
          <Typography variant="body2">{comments}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PostPreview;
