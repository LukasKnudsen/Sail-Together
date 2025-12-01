import mapboxgl from "mapbox-gl";
import type { EventFeature } from "@/lib/eventsToGeoJSON";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { GenericFeature } from "@/types/map";

interface PopupProps {
  map: mapboxgl.Map;
  feature: EventFeature | GenericFeature;
}

export default function Popup({ map, feature }: PopupProps) {
  const { geometry, properties } = feature;

  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (!map) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 16,
    });

    popupRef.current = popup;

    return () => {
      popup.remove();
    };
  }, [map]);

  useEffect(() => {
    if (!feature) return;

    const popup = popupRef.current;
    if (!popup) return;

    popup
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .setDOMContent(contentRef.current)
      .addTo(map);

    return () => {
      popup.remove();
      popupRef.current = null;
    };
  }, [feature, map, geometry.coordinates]);

  if (!feature) return null;

  return (
    <>
      {createPortal(
        <div className="bg-card overflow-hidden rounded-xl border border-border">
          <div className="relative aspect-square size-40 bg-muted"></div>
          <div className="p-2">
            <p className="text-base font-medium">{properties.title}</p>
          </div>
        </div>,
        contentRef.current
      )}
    </>
  );
}
