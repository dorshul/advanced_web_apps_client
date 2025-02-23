import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import {
  Typography,
  CardContent,
  CardMedia,
  Card,
  IconButton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Post from "../../types/posts";
import { useComments } from "../../hooks/comments";

type PostPreviewProps = {
  post: Omit<Post, "sender">;
  disabled?: boolean;
};

const PostPreview = ({ post, disabled = false }: PostPreviewProps) => {
  const { data: comments, isLoading: isCommentsLoading } = useComments(
    post._id
  );

  const { title, content } = post;
  const imageUrl = post.imageUrl || "";
  const navigate = useNavigate();

  return (
    <Card
      sx={{ width: 350, border: "1px solid rgb(163, 162, 165)", margin: 1 }}
      onClick={() => (!disabled ? navigate(`/posts/${post?._id}`) : null)}
    >
      <CardMedia sx={{ height: 300, width: 300 }} image={imageUrl} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" mt={1}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {content}
        </Typography>
      </CardContent>
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction={"row"} gap={1} alignItems={"center"} margin={1}>
          <IconButton disabled color="primary">
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2">{post.likes}</Typography>
        </Stack>

        <Stack direction={"row"} gap={1} alignItems={"center"} margin={1}>
          <IconButton disabled color="primary">
            <CommentIcon />
          </IconButton>
          <Typography variant="body2">
            {isCommentsLoading ? "Loading..." : comments?.length}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default PostPreview;
