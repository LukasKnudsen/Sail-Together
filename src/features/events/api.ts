import Parse from "@/lib/parse/client";
import { Event, type EventAttributes } from "@/db/types/Event";
import { Location } from "@/db/types/Location";
import type { _User } from "@/db/types/_User";

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

export async function getEvents(): Promise<EventAttributes[]> {
  const query = new Parse.Query(Event);
  query.include("locationId");
  query.include("createdById");

  const results = await query.find();
  return results.map((event) => parseToJSON<EventAttributes>(event));
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
  priceCurrency?: "DKK" | "EUR" | "USD";
}): Promise<Event> {
  // Get current user
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


