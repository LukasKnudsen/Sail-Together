import { getPosts } from "@/features/posts/api";
import type { PostWithRelations } from "@/types/post";

export async function getPostsWithRelations(): Promise<PostWithRelations[]> {
  const dbPosts = await getPosts();

  const dbWithRelations: PostWithRelations[] = dbPosts.map((p) => ({
    id: p.id,
    mediaUrl: p.mediaUrl,
    mediaAlt: p.mediaAlt ?? null,
    createdAt:
      p.createdAt instanceof Date
        ? p.createdAt.toISOString()
        : String(p.createdAt),

    likeCount: p.likeCount ?? 0,
    commentCount: p.commentCount ?? 0,
    hasLiked: false,

    user: {
      id: p.userId ?? "",
      name: p.userName ?? "Unknown sailor",
      avatarUrl: "", 
    },

    location: p.locationId
      ? {
          id: p.locationId,
          name: p.locationName ?? "Unknown location",
        }
      : undefined,
  }));

  return dbWithRelations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}