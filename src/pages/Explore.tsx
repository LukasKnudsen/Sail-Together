import { useEffect, useState } from "react";
import { Container } from "../components/ui/container";
import { Feed } from "../components/feed/Feed";
import type { PostWithRelations } from "../types/post";
import { getPostsWithRelations } from "../data/posts";
import CreatePostForm from "../components/forms/CreatePostForm";
import { CreatePostPrompt } from "../components/feed/CreatePostButton";

export default function Explore() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  async function loadPosts() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPostsWithRelations();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  return (
    <Container>
      <div className="mx-auto flex max-w-xl flex-col gap-6 py-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Your feed</h1>
          <p className="text-sm text-gray-500">See news from friends</p>
        </header>

        <CreatePostPrompt onAddPost={() => setIsCreateOpen(true)} />

        <Feed initialPosts={posts} isLoading={isLoading} error={error} />
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-lg">
            <CreatePostForm
              onCancel={() => setIsCreateOpen(false)}
              onCreated={async () => {
                setIsCreateOpen(false);
                await loadPosts();
              }}
            />
          </div>
        </div>
      )}
    </Container>
  );
}
