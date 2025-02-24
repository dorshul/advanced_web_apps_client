import React, { useState } from "react";
import { useComments, useAddComment } from "../hooks/comments";
import Post from "../types/posts";
import { Link } from "react-router-dom";

interface PostProps {
  post: Post;
}

const PostComponent: React.FC<PostProps> = ({ post }) => {
  const { data: comments, isLoading: loadingComments } = useComments(post._id);
  const { mutateAsync: addCommentMutation, isPending } = useAddComment(
    post._id
  );
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation(commentText);
    setCommentText("");
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        marginBottom: "1rem",
        padding: "1rem",
      }}
    >
      <Link to={`/posts/${post._id}`}>
        <h2>{post.title}</h2>
      </Link>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ maxWidth: "100%" }}
        />
      )}
      <p>{post.content}</p>
      <div>
        <h3>Comments</h3>
        {loadingComments ? (
          <p>Loading comments...</p>
        ) : comments && comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <li key={comment._id}>
                <strong>{comment.sender}:</strong> {comment.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
        <div>
          <textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleAddComment} disabled={isPending}>
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
