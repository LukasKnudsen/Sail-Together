import Parse from "parse";

import type { Post } from "./Post";
import type { _User } from "./_User";

export interface PostLikeAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  postId: Post;
  userId: _User;
}

export class PostLike extends Parse.Object<PostLikeAttributes> {
  static className: string = "PostLike";

  constructor(data?: Partial<PostLikeAttributes>) {
    super("PostLike", data as PostLikeAttributes);
  }

  get postId(): Post {
    return super.get("postId");
  }
  set postId(value: Post) {
    super.set("postId", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }
}

Parse.Object.registerSubclass("PostLike", PostLike);

