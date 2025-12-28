import Parse from "parse";

import type { Job } from "./Job";

export interface JobRequirementAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  jobId: Job;
  order: number;
  requirement: string;
}

export class JobRequirement extends Parse.Object<JobRequirementAttributes> {
  static className: string = "JobRequirement";

  constructor(data?: Partial<JobRequirementAttributes>) {
    super("JobRequirement", data as JobRequirementAttributes);
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

  get requirement(): string {
    return super.get("requirement");
  }
  set requirement(value: string) {
    super.set("requirement", value);
  }
}

Parse.Object.registerSubclass("JobRequirement", JobRequirement);

