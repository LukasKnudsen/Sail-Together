// React hooks wrapping the API calls
import { useState, useEffect, useCallback } from "react";
import {
  getCurrentUserProfile,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  updateEmail,
  type UserProfile,
} from "./api";

/**
 * Hook to get the current user's profile
 */
export function useCurrentUserProfile(autoFetch = true) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCurrentUserProfile();
      setProfile(data);
      return data;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to fetch profile";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [autoFetch, fetchProfile]);

  return { profile, fetchProfile, isLoading, error };
}

/**
 * Hook to get a user profile by ID
 */
export function useUserProfile(userId: string | null, autoFetch = true) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (id?: string) => {
      const targetId = id || userId;
      if (!targetId) return null;

      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserProfile(targetId);
        setProfile(data);
        return data;
      } catch (err: any) {
        const message = err instanceof Error ? err.message : "Failed to fetch profile";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (autoFetch && userId) {
      fetchProfile();
    }
  }, [autoFetch, userId, fetchProfile]);

  return { profile, fetchProfile, isLoading, error };
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (data: {
    name?: string;
    phone?: string;
    avatarUrl?: string;
    location?: string;
    about?: string;
    skills?: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateUserProfile(data);
      return true;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}

/**
 * Hook to update password
 */
export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePassword(currentPassword, newPassword);
      return true;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to update password";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}

/**
 * Hook to update email
 */
export function useUpdateEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (newEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateEmail(newEmail);
      return true;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to update email";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}
