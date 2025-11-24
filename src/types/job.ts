/**
 * Normalized Job table for PostgreSQL
 * - Uses locationId foreign key instead of nested Location
 * - Description moved to main table (was in JobMeta)
 * - Requirements, experience, and qualifications are in separate tables
 */
export interface Job {
  id: string;
  title: string;
  type: JobType;
  date: Date | string;
  vessel: string;
  isFavorite?: boolean;
  locationId?: string; // Foreign key to Location table
  createdById?: string; // Foreign key to User table (optional)
  description: string; // Moved from JobMeta
  
  createdAt?: Date;
  updatedAt?: Date;
}

export type JobType = "Permanent" | "Contract" | "Seasonal" | "Temporary";

/**
 * Job requirement (normalized from JobMeta.requirements[])
 */
export interface JobRequirement {
  id: string;
  jobId: string; // Foreign key to Job table
  requirement: string;
  order: number; // For maintaining order
  createdAt?: Date;
}

/**
 * Job experience (normalized from JobMeta.experience[])
 */
export interface JobExperience {
  id: string;
  jobId: string; // Foreign key to Job table
  experience: string;
  order: number; // For maintaining order
  createdAt?: Date;
}

/**
 * Job qualification (normalized from JobMeta.qualifications[])
 */
export interface JobQualification {
  id: string;
  jobId: string; // Foreign key to Job table
  qualification: string;
  order: number; // For maintaining order
  createdAt?: Date;
}

/**
 * Job with joined relations (for API responses)
 * Use this when you need the full location and related arrays
 */
export interface JobWithRelations extends Omit<Job, "locationId"> {
  location: {
    id: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  requirements: JobRequirement[];
  experience: JobExperience[];
  qualifications: JobQualification[];
  createdBy?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
