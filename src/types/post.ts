/**
 * Normalized Post table for PostgreSQL
 * - Uses userId foreign key instead of nested User
 * - Uses locationId foreign key instead of nested LocationTag
 * - Comments are in separate Comment table
 * - hasLiked is user-specific and should be computed per user
 */
export interface Post {
  id: string;
  userId: string; // Foreign key to User table
  mediaUrl: string;
  mediaAlt?: string;
  locationId?: string; // Foreign key to Location table (optional)
  createdAt: Date | string;
  likeCount: number;
  commentCount: number;
  
  updatedAt?: Date;
}

/**
 * Post like (for tracking which users liked which posts)
 * This enables hasLiked computation and prevents duplicate likes
 */
export interface PostLike {
  id: string;
  postId: string; // Foreign key to Post table
  userId: string; // Foreign key to User table
  createdAt: Date | string;
}

/**
 * Normalized Comment table for PostgreSQL
 * - Uses userId foreign key instead of nested User
 * - Uses postId foreign key to Post table
 */
export interface Comment {
  id: string;
  postId: string; // Foreign key to Post table
  userId: string; // Foreign key to User table
  text: string;
  createdAt: Date | string;
  updatedAt?: Date;
}

/**
 * Post with joined relations (for API responses)
 * Use this when you need the full user, location, and comments
 */
export type PostWithRelations = {
  id: string;

  mediaUrl: string;
  mediaAlt: string | null;
  createdAt: string; 

  likeCount: number;
  commentCount: number;
  hasLiked: boolean;

  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };

  location?: {
    id: string;
    name: string;
  };
};


/**
 * Comment with joined user (for API responses)
 */
export interface CommentWithUser extends Omit<Comment, "userId"> {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}
  