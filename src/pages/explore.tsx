import PostList from "../components/posts/posts-list";
import { usePosts } from "../hooks/posts";

const ExplorePage = () => {
  const { data: posts, isLoading, error } = usePosts({});

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <div style={{ maxWidth: "150vh", margin: "0 auto" }}>
      <PostList posts={posts || []} />
    </div>
  );
};

export default ExplorePage;
