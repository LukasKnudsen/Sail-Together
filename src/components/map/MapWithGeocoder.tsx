import { useRef, useEffect, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface LocationData {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

interface MapWithGeocoderProps {
  onLocationSelect?: (location: LocationData) => void;
  value?: LocationData | null;
}

export default function MapWithGeocoder({ onLocationSelect, value }: MapWithGeocoderProps) {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [inputValue, setInputValue] = useState(value?.name || "");

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
      center: value ? [value.longitude, value.latitude] : [12.5683, 55.6761],
      zoom: value ? 15 : 10,
      attributionControl: false,
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Update map center when value changes
  useEffect(() => {
    if (value && mapRef.current) {
      mapRef.current.flyTo({
        center: [value.longitude, value.latitude],
        zoom: 15,
      });
      setInputValue(value.name);
    }
  }, [value]);

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl">
      <div className="absolute top-4 right-4 left-4 z-10">
        <SearchBox
          accessToken={MAPBOX_API_KEY}
          map={mapRef.current ?? undefined}
          mapboxgl={mapboxgl}
          value={inputValue}
          options={{
            proximity: [12.5683, 55.6761],
          }}
          onChange={(d) => {
            setInputValue(d);
          }}
          onRetrieve={(result) => {
            if (result.features && result.features.length > 0) {
              const feature = result.features[0];
              const coordinates = feature.geometry.coordinates;
              const locationData: LocationData = {
                name:
                  feature.properties.name || feature.properties.full_address || "Selected Location",
                address: feature.properties.full_address || feature.properties.name || "",
                longitude: coordinates[0],
                latitude: coordinates[1],
              };

              if (onLocationSelect) {
                onLocationSelect(locationData);
              }
            }
          }}
          marker
        />
      </div>
      <div id="map-container" ref={mapContainerRef} className="absolute inset-0 size-full" />
    </div>
  );
}
