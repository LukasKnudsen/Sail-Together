import Parse from "parse";

import type { _User } from "./_User";

export interface ExperienceAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  location: string;
  title: string;
  userId: _User;
  vessel: string;
}

export class Experience extends Parse.Object<ExperienceAttributes> {
  static className: string = "Experience";

  constructor(data?: Partial<ExperienceAttributes>) {
    super("Experience", data as ExperienceAttributes);
  }

  get date(): Date {
    return super.get("date");
  }
  set date(value: Date) {
    super.set("date", value);
  }

  get location(): string {
    return super.get("location");
  }
  set location(value: string) {
    super.set("location", value);
  }

  get title(): string {
    return super.get("title");
  }
  set title(value: string) {
    super.set("title", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }

  get vessel(): string {
    return super.get("vessel");
  }
  set vessel(value: string) {
    super.set("vessel", value);
  }
}

Parse.Object.registerSubclass("Experience", Experience);

