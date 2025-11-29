import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { CategorySlug } from "@/types/category";
import WhenPanel from "../WhenPanel";
import OptionItem from "../OptionItem";
import LocationAutocomplete from "../LocationAutocomplete";

export interface SuggestedLocation {
  name: string;
  description: string;
  className?: string;
}

export interface EventTypeOption {
  id: CategorySlug;
  label: string;
  description: string;
  color: string;
}

export const SUGGESTED_LOCATIONS: SuggestedLocation[] = [
  {
    name: "Skovshoved, Aarhus, Rungsted",
    description: "For autumn regatta hotspots",
  },
  {
    name: "Amager Strand, Svendborg",
    description: "For winter sailing training sessions",
  },
  {
    name: "Tuborg Havn, Dragør, Skudehavnen",
    description: "Meetups & Dock BBQs",
  },
];

export const EVENT_TYPES: EventTypeOption[] = [
  {
    id: "race",
    label: "Race / Regatta",
    description: "Competitive sailing events and club regattas.",
    color: "bg-blue-100",
  },
  {
    id: "cruise",
    label: "Cruise / Trip",
    description: "Casual group trips and weekend sails.",
    color: "bg-sky-100",
  },
  {
    id: "meetup",
    label: "Meetup / Social",
    description: "Dock gatherings and community meetups.",
    color: "bg-amber-100",
  },
  {
    id: "training",
    label: "Training / Workshop",
    description: "Sailing lessons or navigation courses.",
    color: "bg-green-100",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Workdays, boat prep, or dock repairs.",
    color: "bg-neutral-200",
  },
  {
    id: "party",
    label: "Party",
    description: "After-sail parties and harbor celebrations.",
    color: "bg-pink-100",
  },
  {
    id: "meeting",
    label: "Club Meeting",
    description: "Official club meetings or AGMs.",
    color: "bg-purple-100",
  },
  {
    id: "open-day",
    label: "Open Day / Try Sailing",
    description: "Events for new sailors or public demos.",
    color: "bg-lime-100",
  },
  {
    id: "charity",
    label: "Charity Sail",
    description: "Fundraisers or awareness regattas.",
    color: "bg-indigo-100",
  },
  {
    id: "other",
    label: "Other",
    description: "Custom or unclassified events.",
    color: "bg-gray-100",
  },
];

function labelForRange(r?: DateRange) {
  if (!r?.from) return "When";
  if (!r.to || r.to.getTime() === r.from.getTime()) return format(r.from, "dd MMM");
  const sameMonth = format(r.from, "MMM") === format(r.to, "MMM");
  return sameMonth
    ? `${format(r.from, "d")}–${format(r.to, "d MMM")}`
    : `${format(r.from, "d MMM")}–${format(r.to, "d MMM")}`;
}

export type EventSearchState = {
  isOpen: boolean;
  stepIndex: number;
  where: string | null;
  eventType: CategorySlug | null;
  when?: DateRange | undefined;
};

export type EventSearchAction =
  | { type: "OPEN"; stepIndex: number }
  | { type: "CLOSE" }
  | { type: "TOGGLE_TAB"; index: number }
  | { type: "NEXT_STEP" }
  | { type: "SET_WHERE"; value: string | null }
  | { type: "SET_EVENT_TYPE"; value: CategorySlug | null }
  | { type: "SET_WHEN"; value: DateRange | undefined };

export function eventSearchReducer(
  state: EventSearchState,
  action: EventSearchAction
): EventSearchState {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, stepIndex: action.stepIndex ?? state.stepIndex };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE_TAB":
      if (state.isOpen && state.stepIndex === action.index) {
        return { ...state, isOpen: false };
      }
      return { ...state, isOpen: true, stepIndex: action.index };
    case "NEXT_STEP":
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, 2) };
    case "SET_WHERE":
      return { ...state, where: action.value };
    case "SET_EVENT_TYPE":
      return { ...state, eventType: action.value };
    case "SET_WHEN":
      return { ...state, when: action.value };
    default:
      return state;
  }
}

export const searchEventConfig = {
  steps: [
    { id: "where", label: "Where" },
    { id: "type", label: "Type" },
    { id: "when", label: "When" },
  ],
  ariaLabel: "Search event bar",
  initialState: {
    isOpen: false,
    stepIndex: 0,
    where: null,
    eventType: null,
    when: undefined,
  } as EventSearchState,
  reducer: eventSearchReducer,
  getTabLabel: (stepId: string, state: EventSearchState) => {
    switch (stepId) {
      case "where":
        return state.where ?? "Where";
      case "type":
        return EVENT_TYPES.find((type) => type.id === state.eventType)?.label ?? "Type";
      case "when":
        return labelForRange(state.when) ?? "When";
      default:
        return "";
    }
  },
  renderStepContent: (
    stepId: string,
    state: EventSearchState,
    dispatch: (action: EventSearchAction) => void
  ) => {
    if (stepId === "where") {
      return (
        <div className="flex flex-col gap-4 px-6">
          <LocationAutocomplete state={state} dispatch={dispatch} />
        </div>
      );
    }

    if (stepId === "type") {
      return (
        <div className="flex flex-col px-6">
          <div className="flex flex-col gap-0.5 py-1">
            {EVENT_TYPES.map((type) => (
              <OptionItem
                key={type.id}
                id={type.id}
                label={type.label}
                description={type.description}
                color={type.color}
                onClick={() => {
                  const next = state.eventType === type.id ? null : type.id;
                  dispatch({ type: "SET_EVENT_TYPE", value: next });
                  if (next) dispatch({ type: "NEXT_STEP" });
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (stepId === "when") {
      return (
        <WhenPanel
          value={state.when}
          onChange={(range) => dispatch({ type: "SET_WHEN", value: range })}
        />
      );
    }

    return null;
  },
  canSearch: (state: EventSearchState) => !!state.where && !!state.eventType && !!state.when?.from,
};
