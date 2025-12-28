import Parse from "parse";

import type { Job } from "./Job";

export interface JobQualificationAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  jobId: Job;
  order: number;
  qualification: string;
}

export class JobQualification extends Parse.Object<JobQualificationAttributes> {
  static className: string = "JobQualification";

  constructor(data?: Partial<JobQualificationAttributes>) {
    super("JobQualification", data as JobQualificationAttributes);
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

  get qualification(): string {
    return super.get("qualification");
  }
  set qualification(value: string) {
    super.set("qualification", value);
  }
}

Parse.Object.registerSubclass("JobQualification", JobQualification);

