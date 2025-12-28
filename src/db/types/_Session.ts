import Parse from "parse";

import type { _User } from "./_User";

export interface _SessionAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  createdWith?: any | undefined;
  expiresAt?: Date | undefined;
  installationId?: string | undefined;
  restricted?: boolean | undefined;
  sessionToken?: string | undefined;
  user?: _User | undefined;
}
export type _Session = Parse.Session<_SessionAttributes>;

