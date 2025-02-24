import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import { Favorite, Comment as CommentIcon } from "@mui/icons-material";
import Post from "../../types/posts";

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  commentCount: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const PostCard = ({
  post,
  onLike,
  commentCount,
  disabled = false,
  onClick,
}: PostCardProps) => {
  const { title, content, imageUrl, likes } = post;

  return (
    <Card
      sx={{
        maxWidth: 400,
        cursor: disabled ? "default" : "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: disabled ? "none" : "scale(1.02)",
        },
      }}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      <CardMedia
        component="img"
        height="300"
        image={imageUrl || "/placeholder-image.jpg"}
        alt={title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              disabled={disabled}
            >
              <Favorite />
            </IconButton>
            <Typography variant="body2">{likes}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="primary" disabled>
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{commentCount}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};
