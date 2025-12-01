import mapboxgl from "mapbox-gl";
import type { EventFeature } from "@/lib/eventsToGeoJSON";
import type { GenericFeature } from "@/types/map";
import type { CategorySlug } from "@/types/category";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { useJobStore } from "@/store/useJobStore";
import { getEventMarkerColor } from "@/lib/eventColors";

interface MarkerProps {
  map: mapboxgl.Map;
  feature: EventFeature | GenericFeature;
  selectedMarker: EventFeature | GenericFeature | null;
  setSelectedMarker: (marker: EventFeature | GenericFeature | null) => void;
}

export default function Marker({ map, feature, selectedMarker, setSelectedMarker }: MarkerProps) {
  const { geometry, properties } = feature;

  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));

  const { hoveredEventId } = useEventStore();
  const { hoveredJobId } = useJobStore();
  const isHovered = properties.id === hoveredEventId || properties.id === hoveredJobId;

  const isSelected = properties.id === selectedMarker?.properties.id;

  // Determine marker color based on event type
  // EventFeature has required category property, GenericFeature has optional category
  const isEventFeature = "category" in properties && properties.category !== undefined;
  const markerColor = isEventFeature
    ? getEventMarkerColor(properties.category as CategorySlug)
    : "bg-blue-500"; // Default color for jobs

  useEffect(() => {
    if (!map) return;

    const marker = new mapboxgl.Marker(contentRef.current)
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [map, geometry.coordinates]);

  console.log("marker render");

  return (
    <>
      {createPortal(
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMarker(feature);
          }}
          className={cn(
            "z-10 size-6 cursor-pointer rounded-full border-2 border-white transition hover:z-20 hover:scale-125",
            markerColor,
            isSelected ? "scale-125" : "",
            isHovered ? "bg-black border-black" : ""
          )}
        />,
        contentRef.current
      )}
    </>
  );
}
