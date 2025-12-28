/**
 * Category lookup table for PostgreSQL
 */
export type CategorySlug =
  | "race"
  | "cruise"
  | "meetup"
  | "training"
  | "maintenance"
  | "party"
  | "meeting"
  | "open-day"
  | "charity"
  | "other";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

