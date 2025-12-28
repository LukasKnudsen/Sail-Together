import type { Feature, FeatureCollection, Point } from "geojson";
import type { EventWithRelations, EventAttributes } from "@/db/types/Event";
import type { CategorySlug } from "@/types/category";
import { getEventWithRelations } from "./dataHelpers";

export type EventFeatureProperties = {
  id: string;
  title: string;
  category: CategorySlug;
};

export type EventFeature = Feature<Point, EventFeatureProperties>;
export type EventFeatureCollection = FeatureCollection<Point, EventFeatureProperties>;

function eventToFeature(event: EventWithRelations): EventFeature {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [event.location.longitude, event.location.latitude],
    },
    properties: {
      id: event.id,
      title: event.title,
      category: event.category.slug,
    },
  };
}

export function eventsToGeoJson(events: EventAttributes[]): EventFeatureCollection {
  return {
    type: "FeatureCollection",
    features: events
      .map((event) => {
        try {
          return getEventWithRelations(event);
        } catch {
          return null;
        }
      })
      .filter((event): event is EventWithRelations => event !== null)
      .filter((event) => event.location?.longitude && event.location?.latitude)
      .map((event) => eventToFeature(event)),
  };
}
