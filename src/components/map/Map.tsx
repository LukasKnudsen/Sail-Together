import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Marker from "./Marker";
import Popup from "./Popup";
import { type EventFeature, type EventFeatureCollection } from "@/lib/eventsToGeoJSON";
import { type GenericFeature, type GenericFeatureCollection } from "@/types/map";

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface MapProps {
  events?: EventFeatureCollection;
  jobs?: GenericFeatureCollection;
  onBoundsChange?: (bounds: { ne: [number, number]; sw: [number, number] }) => void;
}

export default function Map({ events, jobs, onBoundsChange }: MapProps) {
  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<EventFeature | GenericFeature | null>(null);

  useEffect(() => {
    const token = MAPBOX_API_KEY;
    if (!token) {
      console.error("Mapbox API key is missing");
      return;
    }
    mapboxgl.accessToken = token;
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [12.5683, 55.6761],
      zoom: 10,
      attributionControl: false,
    });
    mapRef.current = map;

    mapRef.current.on("load", () => {
      console.log("Map loaded");
      setMapLoaded(true);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedMarker) return;
    mapRef.current!.flyTo({
      center: [selectedMarker.geometry.coordinates[0], selectedMarker.geometry.coordinates[1]],
      zoom: 12,
      duration: 1000,
    });
  }, [selectedMarker]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onMapClick = (e: mapboxgl.MapMouseEvent & { originalEvent: MouseEvent }) => {
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest(".mapboxgl-marker") || target.closest(".mapboxgl-popup")) return;
      setSelectedMarker(null);
    };

    const updateBounds = () => {
      if (!map || !onBoundsChange) return;
      const bounds = map.getBounds();
      if (!bounds) return;
      onBoundsChange({
        ne: [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
        sw: [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
      });
    };

    map.on("click", onMapClick);
    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);

    // Initial bounds
    if (mapLoaded) {
      updateBounds();
    }

    return () => {
      map.off("click", onMapClick);
      map.off("moveend", updateBounds);
      map.off("zoomend", updateBounds);
    };
  }, [mapLoaded, onBoundsChange]);

  return (
    <div className="relative size-full grow overflow-hidden rounded-2xl">
      <div ref={mapContainerRef} className="absolute inset-0 size-full" />
      {(mapLoaded &&
        events?.features.map((location) => (
          <Marker
            key={location.properties.id}
            feature={location}
            map={mapRef.current!}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
        ))) ||
        jobs?.features.map((location) => (
          <Marker
            key={location.properties.id}
            feature={location}
            map={mapRef.current!}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
        ))}
      {mapRef.current && selectedMarker && (
        <Popup key={selectedMarker.properties.id} map={mapRef.current} feature={selectedMarker} />
      )}
    </div>
  );
}
