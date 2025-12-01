import Parse from "@/lib/parse/client";
import { Event, type EventAttributes } from "@/db/types/Event";
import { Location } from "@/db/types/Location";
import type { _User } from "@/db/types/_User";
import type { Currency } from "@/types/event";
import type { EventSearchFilters } from "@/store/useEventStore";

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseToJSON<T>(obj: Event): T {
  const json = obj.toJSON();
  return {
    ...json,
    id: obj.id,
    startDate: obj.get("startDate"),
    endDate: obj.get("endDate") || null,
    priceAmount: obj.get("priceAmount") || null,
    createdAt: obj.get("createdAt"),
    updatedAt: obj.get("updatedAt"),
  } as T;
}

export async function getEvents(filters?: EventSearchFilters): Promise<EventAttributes[]> {
  const query = new Parse.Query(Event);
  query.include("locationId");
  query.include("createdById");

  // Filter by event type (category)
  if (filters?.eventType) {
    query.equalTo("categorySlug", filters.eventType);
  }

  // Filter by date range
  if (filters?.when?.from) {
    const fromDate = filters.when.from;
    // Set start of day (00:00:00)
    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);
    query.greaterThanOrEqualTo("startDate", startOfDay);

    if (filters.when.to) {
      // If range is selected, use the end date
      const endDate = filters.when.to;
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.lessThanOrEqualTo("startDate", endOfDay);
    } else {
      // If single date is selected, set end to end of that day
      const endOfDay = new Date(fromDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.lessThanOrEqualTo("startDate", endOfDay);
    }
  }
  // If no date filter is specified, don't filter by date - show all events

  const results = await query.find();
  let events = results.map((event) => parseToJSON<EventAttributes>(event));

  // Filter by location
  if (filters?.where) {
    const searchTerm = filters.where.toLowerCase();
    
    // If coordinates are available, use proximity-based search (default: 50km radius)
    if (filters.whereCoordinates?.latitude && filters.whereCoordinates?.longitude) {
      const searchLat = filters.whereCoordinates.latitude;
      const searchLon = filters.whereCoordinates.longitude;
      const maxDistanceKm = 50; // Search radius in kilometers
      
      events = events.filter((event) => {
        const location = event.locationId;
        if (!location || !location.latitude || !location.longitude) return false;
        
        const distance = calculateDistance(
          searchLat,
          searchLon,
          location.latitude,
          location.longitude
        );
        
        return distance <= maxDistanceKm;
      });
    } else {
      // Fallback to text-based search if no coordinates available
      events = events.filter((event) => {
        const location = event.locationId;
        if (!location) return false;
        const locationName = (location.name || "").toLowerCase();
        const locationAddress = (location.address || "").toLowerCase();
        return locationName.includes(searchTerm) || locationAddress.includes(searchTerm);
      });
    }
  }

  return events;
}

export async function createEvent({
  title,
  description,
  startDate,
  endDate,
  categorySlug,
  location,
  priceKind,
  priceAmount,
  priceCurrency,
}: {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  categorySlug: string;
  location: {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  priceKind: "free" | "paid";
  priceAmount?: number;
  priceCurrency?: Currency;
}): Promise<Event> {

  const currentUser = Parse.User.current() as _User | null;
  if (!currentUser) {
    throw new Error("User must be logged in to create an event");
  }

  // Create Location
  const locationObj = new Location();
  locationObj.name = location.name;
  locationObj.address = location.address;
  locationObj.longitude = location.longitude;
  locationObj.latitude = location.latitude;

  // Create Event
  const event = new Event();
  event.title = title;
  event.startDate = startDate;
  event.categorySlug = categorySlug;
  event.locationId = locationObj;
  event.priceKind = priceKind;
  event.createdById = currentUser;

  // Set optional fields
  if (description) event.description = description;
  if (endDate) event.endDate = endDate;
  if (priceKind === "paid" && priceAmount) {
    event.priceAmount = priceAmount;
    if (priceCurrency) event.priceCurrency = priceCurrency;
  }

  // Save - Parse will automatically save the Location first
  const saved = await event.save();
  return saved as Event;
}


