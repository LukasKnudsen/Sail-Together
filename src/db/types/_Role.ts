import Parse from "parse";

import type { _User } from "./_User";

export interface _RoleAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string | undefined;
  roles: Parse.Relation<_Role, _Role>;
  users: Parse.Relation<_Role, _User>;
}

export type _Role = Parse.Role<_RoleAttributes>;

