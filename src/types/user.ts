/**
 * Normalized User table for PostgreSQL
 * Extends Parse._User with additional fields
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  rating?: number;
  role?: string;
  location?: string; // Free-form location string
  about?: string;
  skills?: string[]; // Array is OK for simple tags
  
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Normalized Experience table for PostgreSQL
 * - Uses userId foreign key to User table
 */
export interface Experience {
  id: string;
  userId: string; // Foreign key to User table
  title: string;
  location: string;
  vessel: string;
  date: Date | string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Normalized Qualification table for PostgreSQL
 * - Uses userId foreign key to User table
 */
export interface Qualification {
  id: string;
  userId: string; // Foreign key to User table
  name: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Normalized Feedback table for PostgreSQL
 * - Uses userId foreign key (who received the feedback)
 * - Uses authorId foreign key (who wrote the feedback)
 */
export interface Feedback {
  id: string;
  userId: string; // Foreign key to User table (who received feedback)
  authorId: string; // Foreign key to User table (who wrote feedback)
  comment: string;
  createdAt: Date | string;
  
  updatedAt?: Date;
}

/**
 * UserProfile with joined relations (for API responses)
 * Use this when you need the full user with experiences, qualifications, and feedback
 */
export interface UserProfile extends User {
  experiences: Experience[];
  qualifications: Qualification[];
  feedback: FeedbackWithAuthor[];
}

/**
 * Feedback with joined author (for API responses)
 */
export interface FeedbackWithAuthor extends Omit<Feedback, "authorId"> {
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
