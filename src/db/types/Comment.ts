import Parse from "parse";

import type { Post } from "./Post";
import type { _User } from "./_User";

export interface CommentAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  postId: Post;
  text: string;
  userId: _User;
}

export class Comment extends Parse.Object<CommentAttributes> {
  static className: string = "Comment";

  constructor(data?: Partial<CommentAttributes>) {
    super("Comment", data as CommentAttributes);
  }

  get postId(): Post {
    return super.get("postId");
  }
  set postId(value: Post) {
    super.set("postId", value);
  }

  get text(): string {
    return super.get("text");
  }
  set text(value: string) {
    super.set("text", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }
}

Parse.Object.registerSubclass("Comment", Comment);

