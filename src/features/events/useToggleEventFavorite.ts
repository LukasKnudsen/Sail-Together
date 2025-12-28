import { mutate, useSWRConfig } from "swr";
import { toggleEventFavorite } from "./api";
import type { EventAttributes } from "@/db/types/Event";

// Helper function to update event in cache
function updateEventInCache(
  current: EventAttributes[] | EventAttributes | null | undefined,
  id: string,
  newFavoriteStatus: boolean
): typeof current {
  if (!current) return current;

  if (Array.isArray(current)) {
    return current.map((e) => (e.id === id ? { ...e, isFavorite: newFavoriteStatus } : e));
  }

  if (current.id !== id) return current;
  return { ...current, isFavorite: newFavoriteStatus };
}

export function useToggleEventFavorite(key: string | null) {
  const { cache } = useSWRConfig();

  return async function toggle(id: string) {
    if (!key) return;

    // Get the event data from the current cache before updating
    let eventData: EventAttributes | null = null;
    let currentFavoriteStatus = false;

    // Read from cache to get the full event data
    const cacheData = cache.get(key);
    if (cacheData?.data) {
      const data = cacheData.data as EventAttributes[] | EventAttributes | null | undefined;
      if (Array.isArray(data)) {
        const event = data.find((e) => e.id === id);
        if (event) {
          eventData = event;
          currentFavoriteStatus = event.isFavorite ?? false;
        }
      } else if (data && data.id === id) {
        eventData = data;
        currentFavoriteStatus = data.isFavorite ?? false;
      }
    }

    const newFavoriteStatus = !currentFavoriteStatus;

    // First, optimistically update the current cache (this happens synchronously, no delay)
    mutate(
      key,
      (current: EventAttributes[] | EventAttributes | null | undefined) => {
        if (!current) return current;

        if (Array.isArray(current)) {
          return current.map((e) =>
            e.id === id ? { ...e, isFavorite: newFavoriteStatus } : e
          );
        }

        if (current.id === id) {
          return { ...current, isFavorite: newFavoriteStatus };
        }
        return current;
      },
      { revalidate: false }
    );

    // Update "favorite-events" cache - add or remove the event
    mutate(
      "favorite-events",
      (current: EventAttributes[] | null | undefined) => {
        if (newFavoriteStatus) {
          // Adding to favorites
          if (!current) {
            // If cache doesn't exist yet, create it with this event
            return eventData ? [{ ...eventData, isFavorite: true }] : [];
          }
          // Check if event already exists
          const exists = current.some((e) => e.id === id);
          if (!exists && eventData) {
            // Add the event to favorites list
            return [{ ...eventData, isFavorite: true }, ...current];
          }
          // Update if it exists
          return current.map((e) => (e.id === id ? { ...e, isFavorite: true } : e));
        } else {
          // Removing from favorites - filter it out
          if (!current) return [];
          return current.filter((e) => e.id !== id);
        }
      },
      { revalidate: false }
    );

    // Update all event caches that might contain this event
    // Use a matcher to update any cache key that starts with "events"
    mutate(
      (cacheKey: string | string[]) => {
        if (typeof cacheKey === "string" && cacheKey.startsWith("events")) {
          return true;
        }
        if (Array.isArray(cacheKey) && cacheKey[0] === "events") {
          return true;
        }
        return false;
      },
      (current: EventAttributes[] | EventAttributes | null | undefined) =>
        updateEventInCache(current, id, newFavoriteStatus),
      { revalidate: false }
    );

    // Then sync with server in the background
    try {
      const serverStatus = await toggleEventFavorite(id);
      
      // Get updated event data from cache after server sync
      const updatedCacheData = cache.get(key);
      let updatedEventData: EventAttributes | null = eventData;
      if (updatedCacheData?.data) {
        const data = updatedCacheData.data as EventAttributes[] | EventAttributes | null | undefined;
        if (Array.isArray(data)) {
          const event = data.find((e) => e.id === id);
          if (event) updatedEventData = event;
        } else if (data && data.id === id) {
          updatedEventData = data;
        }
      }

      // Update with server response to ensure consistency
      mutate(
        key,
        (current: EventAttributes[] | EventAttributes | null | undefined) =>
          updateEventInCache(current, id, serverStatus),
        {
          revalidate: false,
        }
      );

      mutate(
        "favorite-events",
        (current: EventAttributes[] | null | undefined) => {
          if (serverStatus) {
            // Adding to favorites
            if (!current) {
              return updatedEventData ? [{ ...updatedEventData, isFavorite: true }] : [];
            }
            const exists = current.some((e) => e.id === id);
            if (!exists && updatedEventData) {
              // Add the event to favorites list
              return [{ ...updatedEventData, isFavorite: true }, ...current];
            }
            // Update if it exists
            return current.map((e) => (e.id === id ? { ...e, isFavorite: true } : e));
          } else {
            // Removing from favorites
            if (!current) return [];
            return current.filter((e) => e.id !== id);
          }
        },
        { revalidate: false }
      );

      mutate(
        (cacheKey: string | string[]) => {
          if (typeof cacheKey === "string" && cacheKey.startsWith("events")) {
            return true;
          }
          if (Array.isArray(cacheKey) && cacheKey[0] === "events") {
            return true;
          }
          return false;
        },
        (current: EventAttributes[] | EventAttributes | null | undefined) => {
          return updateEventInCache(current, id, serverStatus);
        },
        { revalidate: false }
      );
    } catch (error) {
      // Rollback on error
      mutate(
        key,
        (current: EventAttributes[] | EventAttributes | null | undefined) =>
          updateEventInCache(current, id, currentFavoriteStatus),
        {
          revalidate: false,
        }
      );

      mutate(
        "favorite-events",
        (current: EventAttributes[] | null | undefined) => {
          if (currentFavoriteStatus) {
            // Was favorited, so add it back
            if (!current) {
              return eventData ? [{ ...eventData, isFavorite: true }] : [];
            }
            const exists = current.some((e) => e.id === id);
            if (!exists && eventData) {
              return [{ ...eventData, isFavorite: true }, ...current];
            }
            return current.map((e) => (e.id === id ? { ...e, isFavorite: true } : e));
          } else {
            // Was not favorited, so remove it
            if (!current) return [];
            return current.filter((e) => e.id !== id);
          }
        },
        { revalidate: false }
      );

      mutate(
        (cacheKey: string | string[]) => {
          if (typeof cacheKey === "string" && cacheKey.startsWith("events")) {
            return true;
          }
          if (Array.isArray(cacheKey) && cacheKey[0] === "events") {
            return true;
          }
          return false;
        },
        (current: EventAttributes[] | EventAttributes | null | undefined) => {
          return updateEventInCache(current, id, currentFavoriteStatus);
        },
        { revalidate: false }
      );

      console.error("Failed to toggle favorite:", error);
    }
  };
}

