import type { PostWithRelations } from "@/types/post";
import { PostCard } from "./PostCard";

type FeedProps = { initialPosts?: PostWithRelations[]; isLoading?: boolean; error?: string | null };

export function Feed({ initialPosts = [], isLoading = false, error = null }: FeedProps) {
  if (isLoading) {
    return <p className="text-grey-500 text-center">Loading posts...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }
  if (initialPosts.length === 0) {
    return <p className="text-center text-gray-500">No posts available. Where is everybody?</p>;
  }

  return (
    <div
      className="mx-auto max-w-xl space-y-6 pb-2"
      role="feed"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {initialPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
