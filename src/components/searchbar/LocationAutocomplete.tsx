import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { GeocodingResponse, GeocodingFeature } from "@mapbox/search-js-core";
import OptionItem from "./OptionItem";
import { MapPin } from "lucide-react";
import {
  SUGGESTED_LOCATIONS,
  type EventSearchState,
  type EventSearchAction,
} from "./configs/searchEventConfig";

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface LocationAutocompleteProps {
  state: EventSearchState;
  dispatch: (action: EventSearchAction) => void;
}

export default function LocationAutocomplete({ state, dispatch }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(state.where || "");
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
      url.searchParams.set("access_token", MAPBOX_API_KEY);
      url.searchParams.set("q", searchQuery);
      url.searchParams.set("limit", "5");
      url.searchParams.set("country", "dk");

      const response = await fetch(url.toString(), {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Mapbox geocoding failed");

      const data: GeocodingResponse = await response.json();

      console.log(data);

      setSuggestions(data.features);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Error searching locations:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // No search if query is empty or less than 2 characters
    if (!query.trim() || query.length < 2) {
      return;
    }

    // Debounce the search
    const timer = setTimeout(() => {
      searchLocations(query);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, searchLocations]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (!newQuery.trim() || newQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a location"
      />
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-0.5 py-1">
          {suggestions.map((suggestion) => {
            const locationName = suggestion.properties.name;
            return (
              <OptionItem
                key={suggestion.id}
                id={suggestion.id}
                label={locationName}
                description={suggestion.properties.full_address}
                onClick={() => {
                  const next = state.where === locationName ? null : locationName;
                  dispatch({ type: "SET_WHERE", value: next });
                  if (next) {
                    setQuery(locationName);
                    setSuggestions([]);
                    dispatch({ type: "NEXT_STEP" });
                  } else {
                    setQuery("");
                  }
                }}
                color="bg-secondary"
                icon={<MapPin className="text-muted-foreground size-8" />}
              />
            );
          })}
        </div>
      )}
      {/* Default suggestions */}
      {query.length === 0 && suggestions.length === 0 && (
        <div className="flex flex-col gap-0.5 py-1">
          {SUGGESTED_LOCATIONS.map((location) => (
            <OptionItem
              key={location.name}
              id={location.name}
              label={location.name}
              description={location.description}
              onClick={() => {
                const next = state.where === location.name ? null : location.name;
                dispatch({ type: "SET_WHERE", value: next });
                if (next) {
                  setQuery(location.name);
                  setSuggestions([]);
                  dispatch({ type: "NEXT_STEP" });
                } else {
                  setQuery("");
                }
              }}
              className={location.className}
              color="bg-secondary"
              icon={<MapPin className="text-muted-foreground size-8" />}
            />
          ))}
        </div>
      )}
    </>
  );
}
