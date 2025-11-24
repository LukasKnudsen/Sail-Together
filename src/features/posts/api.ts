// all Parse calls related to posts
import Parse from "@/lib/parse/client";

export type Post = {
  id: string;
  userId: string | null;
  userName: string | null;
  mediaUrl: string;
  mediaAlt: string | null;
  locationId: string | null;
  locationName: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
};

export type CreatePostInput = {
  mediaUrl?: string;        // Link insert
  mediaAlt?: string;
  locationId?: string;
  imageFile?: File | null;  // Upload from disk
};

function mapPost(p: Parse.Object): Post {
  const user = p.get("userId") as Parse.User | undefined;
  const location = p.get("locationId") as Parse.Object | undefined;

  return {
    id: p.id,
    userId: user?.id ?? null,
    userName: (user && user.get("username")) ?? null,
    mediaUrl: p.get("mediaUrl"),
    mediaAlt: p.get("mediaAlt") ?? null,
    locationId: location?.id ?? null,
    locationName: (location && location.get("name")) ?? null,
    likeCount: p.get("likeCount") ?? 0,
    commentCount: p.get("commentCount") ?? 0,
    createdAt: p.createdAt ?? new Date(),
  };
}

export async function getPosts(limit = 20): Promise<Post[]> {
  const query = new Parse.Query("Post");

  // user + location for mapping
  query.include("userId");
  query.include("locationId");

  query.descending("createdAt");
  query.limit(limit);

  try {
    const results = await query.find();
    return results.map(mapPost);
  } catch (err: any) {
    console.error("Failed to fetch posts:", err.message);
    throw err;
  }
}

export async function createPost({
  mediaUrl,
  mediaAlt,
  locationId,
  imageFile,
}: CreatePostInput): Promise<Post> {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("You must be logged in to create a post");
  }

  // 1) Hvis der er en fil, upload den til Parse Files
  let finalMediaUrl = mediaUrl?.trim() || "";

  if (imageFile) {
    const parseFile = new Parse.File(imageFile.name, imageFile);
    await parseFile.save();
    finalMediaUrl = parseFile.url() || finalMediaUrl;
  }

  if (!finalMediaUrl) {
    throw new Error("Image is required (URL or uploaded file)");
  }

  // 2) Opret Post objektet
  const PostClass = Parse.Object.extend("Post");
  const post = new PostClass();

  // pointer til _User (userId)
  post.set("userId", currentUser);

  // image
  post.set("mediaUrl", finalMediaUrl);
  if (mediaAlt) {
    post.set("mediaAlt", mediaAlt);
  }

  // pointer til Location hvis vi har en id
  if (locationId) {
    const LocationClass = Parse.Object.extend("Location");
    const location = new LocationClass();
    location.id = locationId;
    post.set("locationId", location);
  }

  // sikr defaults – matcher din schema i migrate.ts
  post.set("likeCount", 0);
  post.set("commentCount", 0);

  const saved = await post.save();
  return mapPost(saved);
}

export async function deletePost(postId: string): Promise<void> {
  const q = new Parse.Query("Post");
  const obj = await q.get(postId);
  await obj.destroy();
}
