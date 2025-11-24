import Parse from "parse";

import type { Job } from "./Job";

export interface JobExperienceAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  experience: string;
  jobId: Job;
  order: number;
}

export class JobExperience extends Parse.Object<JobExperienceAttributes> {
  static className: string = "JobExperience";

  constructor(data?: Partial<JobExperienceAttributes>) {
    super("JobExperience", data as JobExperienceAttributes);
  }

  get experience(): string {
    return super.get("experience");
  }
  set experience(value: string) {
    super.set("experience", value);
  }

  get jobId(): Job {
    return super.get("jobId");
  }
  set jobId(value: Job) {
    super.set("jobId", value);
  }

  get order(): number {
    return super.get("order");
  }
  set order(value: number) {
    super.set("order", value);
  }
}

Parse.Object.registerSubclass("JobExperience", JobExperience);

