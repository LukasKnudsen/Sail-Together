import Parse from "parse";

import type { _User } from "./_User";

export interface FeedbackAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: _User;
  comment: string;
  userId: _User;
}

export class Feedback extends Parse.Object<FeedbackAttributes> {
  static className: string = "Feedback";

  constructor(data?: Partial<FeedbackAttributes>) {
    super("Feedback", data as FeedbackAttributes);
  }

  get authorId(): _User {
    return super.get("authorId");
  }
  set authorId(value: _User) {
    super.set("authorId", value);
  }

  get comment(): string {
    return super.get("comment");
  }
  set comment(value: string) {
    super.set("comment", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }
}

Parse.Object.registerSubclass("Feedback", Feedback);

