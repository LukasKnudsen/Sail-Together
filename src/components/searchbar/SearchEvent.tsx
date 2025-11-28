import SearchBar from "./SearchBar";
import { searchEventConfig, EVENT_TYPES } from "./configs/searchEventConfig";

// Re-export for backwards compatibility
export { EVENT_TYPES };

export default function SearchEvent() {
  return <SearchBar config={searchEventConfig} />;
}
