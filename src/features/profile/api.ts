// all Parse calls related to posts
import Parse from "@/lib/parse/client";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  rating?: number;
  joinedDate?: Date;
  location?: string;
  about?: string;
  skills?: string[];
  role?: string;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    return null;
  }

  try {
    // Fetch fresh data from server
    await currentUser.fetch();

    return {
      id: currentUser.id,
      username: currentUser.get("username"),
      email: currentUser.get("email"),
      name: currentUser.get("name"),
      phone: currentUser.get("phone"),
      avatarUrl: currentUser.get("avatarUrl"),
      rating: currentUser.get("rating"),
      joinedDate: currentUser.get("joinedDate"),
      location: currentUser.get("location"),
      about: currentUser.get("about"),
      skills: currentUser.get("skills") || [],
      role: currentUser.get("role"),
    };
  } catch (err: any) {
    console.error("Failed to fetch user profile:", err.message);
    throw err;
  }
}

/**
 * Get a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const query = new Parse.Query(Parse.User);

  try {
    const user = await query.get(userId);

    return {
      id: user.id,
      username: user.get("username"),
      email: user.get("email"),
      name: user.get("name"),
      phone: user.get("phone"),
      avatarUrl: user.get("avatarUrl"),
      rating: user.get("rating"),
      joinedDate: user.get("joinedDate"),
      location: user.get("location"),
      about: user.get("about"),
      skills: user.get("skills") || [],
      role: user.get("role"),
    };
  } catch (err: any) {
    console.error("Failed to fetch user profile:", err.message);
    return null;
  }
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  location?: string;
  about?: string;
  skills?: string[];
}): Promise<void> {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    throw new Error("User must be logged in to update profile");
  }

  try {
    // Update only provided fields
    if (data.name !== undefined) currentUser.set("name", data.name);
    if (data.phone !== undefined) currentUser.set("phone", data.phone);
    if (data.avatarUrl !== undefined) currentUser.set("avatarUrl", data.avatarUrl);
    if (data.location !== undefined) currentUser.set("location", data.location);
    if (data.about !== undefined) currentUser.set("about", data.about);
    if (data.skills !== undefined) currentUser.set("skills", data.skills);

    await currentUser.save();
  } catch (err: any) {
    console.error("Failed to update user profile:", err.message);
    throw err;
  }
}

/**
 * Update user password
 */
export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    throw new Error("User must be logged in to update password");
  }

  try {
    // Verify current password by attempting to log in
    await Parse.User.logIn(currentUser.get("username"), currentPassword);

    // Update password
    currentUser.set("password", newPassword);
    await currentUser.save();
  } catch (err: any) {
    console.error("Failed to update password:", err.message);
    if (err.code === 101) {
      throw new Error("Current password is incorrect");
    }
    throw err;
  }
}

/**
 * Update user email
 */
export async function updateEmail(newEmail: string): Promise<void> {
  const currentUser = Parse.User.current();

  if (!currentUser) {
    throw new Error("User must be logged in to update email");
  }

  try {
    currentUser.set("email", newEmail);
    await currentUser.save();
  } catch (err: any) {
    console.error("Failed to update email:", err.message);
    if (err.code === 203) {
      throw new Error("This email is already taken");
    }
    throw err;
  }
}
