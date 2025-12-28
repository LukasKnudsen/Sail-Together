/**
 * Normalized Location table for PostgreSQL
 * Shared across Event, Job, Post, etc.
 */
export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  createdAt?: Date;
  updatedAt?: Date;
}

