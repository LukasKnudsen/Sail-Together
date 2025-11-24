import Parse from "parse";

export interface _UserAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  about?: string | undefined;
  authData?: any | undefined;
  avatarUrl?: string | undefined;
  email?: string | undefined;
  emailVerified?: boolean | undefined;
  joinedDate?: Date | undefined;
  location?: string | undefined;
  name?: string | undefined;
  password?: string | undefined;
  phone?: string | undefined;
  rating?: number | undefined;
  role?: string | undefined;
  skills?: any[] | undefined;
  username?: string | undefined;
}

export type _User = Parse.User<_UserAttributes>;
