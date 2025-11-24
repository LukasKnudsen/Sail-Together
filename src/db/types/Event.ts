import Parse from "parse";

import type { _User } from "./_User";
import type { Location } from "./Location";
import type { CategorySlug } from "@/types/category";

export interface EventAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  categorySlug: string;
  createdById?: _User | undefined;
  description?: string | undefined;
  endDate?: Date | undefined;
  isFavorite?: boolean | undefined;
  locationId: Location;
  priceAmount?: number | undefined;
  priceCurrency?: string | undefined;
  priceKind: string;
  startDate: Date;
  title: string;
}

export interface EventWithRelations extends Omit<EventAttributes, "locationId" | "createdById"> {
  category: {
    slug: CategorySlug;
    name: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  createdBy?: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
  // Keeping IDs for backward compatibility and direct access
  locationId: string;
  createdById?: string;
}

export class Event extends Parse.Object<EventAttributes> {
  static className: string = "Event";

  constructor(data?: Partial<EventAttributes>) {
    super("Event", data as EventAttributes);
  }

  get categorySlug(): string {
    return super.get("categorySlug");
  }
  set categorySlug(value: string) {
    super.set("categorySlug", value);
  }

  get createdById(): _User | undefined {
    return super.get("createdById");
  }
  set createdById(value: _User | undefined) {
    super.set("createdById", value);
  }

  get description(): string | undefined {
    return super.get("description");
  }
  set description(value: string | undefined) {
    super.set("description", value);
  }

  get endDate(): Date | undefined {
    return super.get("endDate");
  }
  set endDate(value: Date | undefined) {
    super.set("endDate", value);
  }

  get isFavorite(): boolean | undefined {
    return super.get("isFavorite");
  }
  set isFavorite(value: boolean | undefined) {
    super.set("isFavorite", value);
  }

  get locationId(): Location {
    return super.get("locationId");
  }
  set locationId(value: Location) {
    super.set("locationId", value);
  }

  get priceAmount(): number | undefined {
    return super.get("priceAmount");
  }
  set priceAmount(value: number | undefined) {
    super.set("priceAmount", value);
  }

  get priceCurrency(): string | undefined {
    return super.get("priceCurrency");
  }
  set priceCurrency(value: string | undefined) {
    super.set("priceCurrency", value);
  }

  get priceKind(): string {
    return super.get("priceKind");
  }
  set priceKind(value: string) {
    super.set("priceKind", value);
  }

  get startDate(): Date {
    return super.get("startDate");
  }
  set startDate(value: Date) {
    super.set("startDate", value);
  }

  get title(): string {
    return super.get("title");
  }
  set title(value: string) {
    super.set("title", value);
  }
}

Parse.Object.registerSubclass("Event", Event);
