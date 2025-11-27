import Parse from "parse";

export interface _UserAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  about?: string | undefined;
  authData?: any | undefined;
  avatarUrl?: string | undefined;
  email: string;
  emailVerified?: boolean | undefined;
  location?: string | undefined;
  name?: string | undefined;
  password?: string | undefined;
  phone?: string | undefined;
  rating: number;
  role: string;
  skills?: any[] | undefined;
  username: string;
}

export type _User = Parse.User<_UserAttributes>;
