import React, { useState } from "react";
import { useComments, useAddComment } from "../../hooks/comments";
import PostType from "../../types/posts";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { data: comments, isLoading: commentsLoading } = useComments(post._id);
  const { mutateAsync: addCommentMutation, isPending } = useAddComment(
    post._id
  );
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState(0);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation(commentText);
    setCommentText("");
  };

  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "2rem auto",
        padding: "1rem",
        width: "50%",
        boxSizing: "border-box",
      }}
    >
      <h2>{post.title}</h2>
      {
        <img
          src={post.imageUrl || "https://picsum.photos/200/300"}
          alt={post.title}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            display: "block",
            marginBottom: "1rem",
          }}
        />
      }
      {post.content && <p>{post.content}</p>}
      <button onClick={handleLike}>Like ({likes})</button>
      <div style={{ marginTop: "1rem" }}>
        {commentsLoading ? (
          <p>Loading comments...</p>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "0.5rem 0",
              }}
            >
              <strong>{comment.sender}</strong>: {comment.content}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            width: "100%",
            height: "80px",
            marginBottom: "0.5rem",
          }}
        />
        <button onClick={handleAddComment} disabled={isPending}>
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Post;
