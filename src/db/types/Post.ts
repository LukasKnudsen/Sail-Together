import Parse from "parse";

import type { Location } from "./Location";
import type { _User } from "./_User";

export interface PostAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  likeCount: number;
  locationId?: Location | undefined;
  mediaAlt?: string | undefined;
  mediaUrl: string;
  userId: _User;
}

export class Post extends Parse.Object<PostAttributes> {
  static className: string = "Post";

  constructor(data?: Partial<PostAttributes>) {
    super("Post", data as PostAttributes);
  }

  get commentCount(): number {
    return super.get("commentCount");
  }
  set commentCount(value: number) {
    super.set("commentCount", value);
  }

  get likeCount(): number {
    return super.get("likeCount");
  }
  set likeCount(value: number) {
    super.set("likeCount", value);
  }

  get locationId(): Location | undefined {
    return super.get("locationId");
  }
  set locationId(value: Location | undefined) {
    super.set("locationId", value);
  }

  get mediaAlt(): string | undefined {
    return super.get("mediaAlt");
  }
  set mediaAlt(value: string | undefined) {
    super.set("mediaAlt", value);
  }

  get mediaUrl(): string {
    return super.get("mediaUrl");
  }
  set mediaUrl(value: string) {
    super.set("mediaUrl", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }
}

Parse.Object.registerSubclass("Post", Post);

