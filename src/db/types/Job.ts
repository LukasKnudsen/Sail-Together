import Parse from "parse";

import type { _User } from "./_User";
import type { Location } from "./Location";

export interface JobAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: _User | undefined;
  date: Date;
  description: string;
  isFavorite?: boolean | undefined;
  locationId: Location;
  title: string;
  type: string;
  vessel: string;
}

export class Job extends Parse.Object<JobAttributes> {
  static className: string = "Job";

  constructor(data?: Partial<JobAttributes>) {
    super("Job", data as JobAttributes);
  }

  get createdById(): _User | undefined {
    return super.get("createdById");
  }
  set createdById(value: _User | undefined) {
    super.set("createdById", value);
  }

  get date(): Date {
    return super.get("date");
  }
  set date(value: Date) {
    super.set("date", value);
  }

  get description(): string {
    return super.get("description");
  }
  set description(value: string) {
    super.set("description", value);
  }

  get isFavorite(): boolean | undefined {
    return super.get("isFavorite");
  }
  set isFavorite(value: boolean | undefined) {
    super.set("isFavorite", value);
  }

  get locationId(): Location {
    return super.get("locationId");
  }
  set locationId(value: Location) {
    super.set("locationId", value);
  }

  get title(): string {
    return super.get("title");
  }
  set title(value: string) {
    super.set("title", value);
  }

  get type(): string {
    return super.get("type");
  }
  set type(value: string) {
    super.set("type", value);
  }

  get vessel(): string {
    return super.get("vessel");
  }
  set vessel(value: string) {
    super.set("vessel", value);
  }
}

Parse.Object.registerSubclass("Job", Job);

