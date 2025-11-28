import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import WhenPanel from "../WhenPanel";
import OptionItem from "../OptionItem";

export interface SuggestedLocation {
  name: string;
  description?: string;
  className?: string;
}

export interface JobType {
  id: string;
  label: string;
  className?: string;
}

export const LOCATIONS: SuggestedLocation[] = [
  { name: "Atlantic Crossing", className: "bg-blue-100" },
  { name: "Mediterranean", className: "bg-green-100" },
  { name: "North America", className: "bg-yellow-100" },
  { name: "South America", className: "bg-red-100" },
  { name: "Northern Europe", className: "bg-purple-100" },
  { name: "UK", className: "bg-pink-100" },
  { name: "Pacific", className: "bg-orange-100" },
  { name: "Caribbean", className: "bg-cyan-100" },
  { name: "Australia", className: "bg-teal-100" },
  { name: "Asia", className: "bg-indigo-100" },
  { name: "Africa", className: "bg-gray-100" },
];

export const JOB_TYPE_OPTIONS: JobType[] = [
  { id: "steeward", label: "Steeward/Stewardess", className: "bg-purple-100" },
  { id: "deckhand", label: "Deckhand", className: "bg-green-100" },
  { id: "first-mate", label: "First Mate", className: "bg-yellow-100" },
  { id: "captain", label: "Captain", className: "bg-orange-100" },
  { id: "engineer", label: "Engineer", className: "bg-blue-100" },
  { id: "chef", label: "Chef", className: "bg-red-100" },
];

function labelForRange(r?: DateRange) {
  if (!r?.from) return "When";
  if (!r.to || r.to.getTime() === r.from.getTime()) return format(r.from, "dd MMM");
  const sameMonth = format(r.from, "MMM") === format(r.to, "MMM");
  return sameMonth
    ? `${format(r.from, "d")}–${format(r.to, "d MMM")}`
    : `${format(r.from, "d MMM")}–${format(r.to, "d MMM")}`;
}

export type JobSearchState = {
  isOpen: boolean;
  stepIndex: number;
  name: string | null;
  position: string | null;
  availability?: DateRange | undefined;
};

export type Filters = {
  name?: string | null;
  position?: string | null;
  availability?: DateRange | undefined;
  activeTab?: string;
};

type JobSearchAction =
  | { type: "OPEN"; stepIndex: number }
  | { type: "CLOSE" }
  | { type: "TOGGLE_TAB"; index: number }
  | { type: "NEXT_STEP" }
  | { type: "SET_LOCATION"; value: string | null }
  | { type: "SET_POSITION"; value: string | null }
  | { type: "SET_AVAILABILITY"; value: DateRange | undefined };

export function jobSearchReducer(state: JobSearchState, action: JobSearchAction): JobSearchState {
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
    case "SET_LOCATION":
      return { ...state, name: action.value };
    case "SET_POSITION":
      return { ...state, position: action.value };
    case "SET_AVAILABILITY":
      return { ...state, availability: action.value };
    default:
      return state;
  }
}

export const searchJobsConfig = {
  steps: [
    { id: "where", label: "Where" },
    { id: "type", label: "Type" },
    { id: "when", label: "When" },
  ],
  ariaLabel: "Search filters",
  initialState: {
    isOpen: false,
    stepIndex: 0,
    name: null,
    position: null,
    availability: undefined,
  } as JobSearchState,
  reducer: jobSearchReducer,
  getTabLabel: (stepId: string, state: JobSearchState) => {
    switch (stepId) {
      case "where":
        return state.name ?? "Where";
      case "type":
        return JOB_TYPE_OPTIONS.find((type) => type.label === state.position)?.label ?? "Type";
      case "when":
        return labelForRange(state.availability) ?? "When";
      default:
        return "";
    }
  },
  renderStepContent: (
    stepId: string,
    state: JobSearchState,
    dispatch: (action: JobSearchAction) => void
  ) => {
    if (stepId === "where") {
      return (
        <div className="flex flex-col gap-4 px-6">
          <div>
            <p className="mb-2 text-xs font-medium">Suggested locations</p>
            <div className="flex flex-col gap-0.5 py-1">
              {LOCATIONS.map((loc) => (
                <OptionItem
                  key={loc.name}
                  id={loc.name}
                  label={loc.name}
                  description={loc.description}
                  className={loc.className}
                  onClick={() => {
                    const next = state.name === loc.name ? null : loc.name;
                    dispatch({ type: "SET_LOCATION", value: next });
                    if (next) dispatch({ type: "NEXT_STEP" });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (stepId === "type") {
      return (
        <div className="flex flex-col px-6">
          <div className="flex flex-col gap-0.5 py-1">
            {JOB_TYPE_OPTIONS.map((type) => (
              <OptionItem
                key={type.id}
                id={type.id}
                label={type.label}
                className={type.className}
                onClick={() => {
                  const next = state.position === type.label ? null : type.label;
                  dispatch({ type: "SET_POSITION", value: next });
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
          value={state.availability}
          onChange={(range) => dispatch({ type: "SET_AVAILABILITY", value: range })}
        />
      );
    }

    return null;
  },
  canSearch: (state: JobSearchState) =>
    !!state.name && !!state.position && !!state.availability?.from,
};
