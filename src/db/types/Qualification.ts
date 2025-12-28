import Parse from "parse";

import type { _User } from "./_User";

export interface QualificationAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  userId: _User;
}

export class Qualification extends Parse.Object<QualificationAttributes> {
  static className: string = "Qualification";

  constructor(data?: Partial<QualificationAttributes>) {
    super("Qualification", data as QualificationAttributes);
  }

  get name(): string {
    return super.get("name");
  }
  set name(value: string) {
    super.set("name", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }
}

Parse.Object.registerSubclass("Qualification", Qualification);

