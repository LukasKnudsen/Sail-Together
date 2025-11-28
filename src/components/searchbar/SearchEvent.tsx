import { cn } from "@/lib/utils";
import { useEffect, useReducer } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, format, isSaturday, isSunday, nextSaturday } from "date-fns";
import type { CategorySlug } from "@/types/category";

interface SuggestedLocation {
  name: string;
  description: string;
  className?: string;
}

interface EventTypeOption {
  id: CategorySlug;
  label: string;
  description: string;
  color: string;
}

const SUGGESTED_LOCATIONS: SuggestedLocation[] = [
  {
    name: "Skovshoved, Aarhus, Rungsted",
    description: "For autumn regatta hotspots",
    className: "bg-yellow-100",
  },
  {
    name: "Amager Strand, Svendborg",
    description: "For winter sailing training sessions",
    className: "bg-green-100",
  },
  {
    name: "Tuborg Havn, Dragør, Skudehavnen",
    description: "Meetups & Dock BBQs",
    className: "bg-red-100",
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

const STEPS = ["Where", "Type", "When"] as const;
type Step = (typeof STEPS)[number];

type State = {
  isOpen: boolean;
  stepIndex: number;
  where: string | null;
  eventType: CategorySlug | null;
  when?: DateRange | undefined;
};

type Action =
  | { type: "OPEN"; stepIndex: number }
  | { type: "CLOSE" }
  | { type: "TOGGLE_TAB"; index: number }
  | { type: "NEXT_STEP" }
  | { type: "SET_WHERE"; value: string | null }
  | { type: "SET_EVENT_TYPE"; value: CategorySlug | null }
  | { type: "SET_WHEN"; value: DateRange | undefined };

function reducer(state: State, action: Action) {
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
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, STEPS.length - 1) };
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

export default function SearchEvent() {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    stepIndex: 0,
    where: null,
    eventType: null,
    when: undefined,
  });

  const containerRef = useClickAway<HTMLDivElement>(() => {
    dispatch({ type: "CLOSE" });
  });

  const activeTab: Step = STEPS[state.stepIndex];

  const tabLabel = (step: Step) => {
    switch (step) {
      case "Where":
        return state.where ?? "Where";
      case "Type":
        return EVENT_TYPES.find((type) => type.id === state.eventType)?.label ?? "Type";
      case "When":
        return labelForRange(state.when) ?? "When";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!state.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.isOpen]);

  const canSearch = !!state.where && !!state.eventType && !!state.when?.from;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-2xl flex-col items-center"
    >
      <div
        role="tablist"
        aria-label="Search event bar"
        tabIndex={-1}
        className="grid w-full grid-cols-4 items-center gap-2 rounded-full bg-neutral-200 p-1.5"
      >
        {STEPS.map((step, i) => {
          const isTabActive = state.isOpen && state.stepIndex === i;
          const tabId = `tab-${step.toLowerCase()}`;
          const panelId = `panel-${step.toLowerCase()}`;
          return (
            <button
              key={step}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isTabActive}
              type="button"
              className={cn(
                "focus-visible:border-ring w-full truncate rounded-full px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isTabActive ? "bg-black text-white" : "text-primary hover:bg-accent/80"
              )}
              onClick={() => dispatch({ type: "TOGGLE_TAB", index: i })}
            >
              {tabLabel(step)}
            </button>
          );
        })}
        <button
          disabled={!canSearch}
          onClick={() => dispatch({ type: "CLOSE" })}
          className="rounded-full bg-blue-500 px-3 py-1.5 text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {state.isOpen && (
        <div
          role="tabpanel"
          id={`panel-${activeTab.toLowerCase()}`}
          aria-labelledby={`tab-${activeTab.toLowerCase()}`}
          className="bg-card border-border absolute top-full z-40 mt-2 w-full overflow-hidden rounded-3xl border py-6 shadow-lg"
        >
          <div className="h-full max-h-96 w-full overflow-y-auto overscroll-contain">
            {activeTab === "Where" && (
              <div className="flex flex-col gap-4 px-6">
                <div>
                  <p className="mb-2 text-xs font-medium">Suggested locations</p>
                  <div className="flex flex-col gap-0.5 py-1">
                    {SUGGESTED_LOCATIONS.map((location) => {
                      return (
                        <button
                          key={location.name}
                          type="button"
                          tabIndex={0}
                          className="hover:bg-secondary focus-visible:border-ring flex w-full flex-row gap-4 rounded-2xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          onClick={() => {
                            const next = state.where === location.name ? null : location.name;
                            dispatch({ type: "SET_WHERE", value: next });
                            if (next) dispatch({ type: "NEXT_STEP" });
                          }}
                        >
                          <div
                            className={cn("size-14 rounded-lg bg-orange-100", location.className)}
                          />
                          <div className="flex flex-col justify-center text-sm font-medium">
                            <p>{location.name}</p>
                            <p className="text-muted-foreground">{location.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Type" && (
              <div className="flex flex-col px-6">
                <div className="flex flex-col gap-0.5 py-1">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      tabIndex={0}
                      className="hover:bg-secondary focus-visible:border-ring flex flex-row gap-4 rounded-2xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      onClick={() => {
                        const next = state.eventType === type.id ? null : type.id;
                        dispatch({ type: "SET_EVENT_TYPE", value: next });
                        if (next) dispatch({ type: "NEXT_STEP" });
                      }}
                    >
                      <div className={cn("size-14 rounded-lg bg-orange-100", type.color)} />
                      <div className="flex flex-col justify-center text-sm font-medium">
                        <p>{type.label}</p>
                        <p className="text-muted-foreground">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "When" && (
              <WhenPanel
                value={state.when}
                onChange={(range) => dispatch({ type: "SET_WHEN", value: range })}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface WhenPanelProps {
  value?: DateRange;
  onChange: (range?: DateRange) => void;
}

function fmt(d: Date) {
  return format(d, "MMM d");
}

function WhenPanel({ value, onChange }: WhenPanelProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  // weekend [Sat..Sun]
  let sat: Date, sun: Date;
  if (isSaturday(today)) {
    sat = today;
    sun = addDays(today, 1);
  } else if (isSunday(today)) {
    sat = addDays(today, -1);
    sun = today;
  } else {
    sat = nextSaturday(today);
    sun = addDays(sat, 1);
  }

  const picks = [
    { key: "today", label: "Today", range: { from: today, to: today }, sub: fmt(today) },
    {
      key: "tomorrow",
      label: "Tomorrow",
      range: { from: tomorrow, to: tomorrow },
      sub: fmt(tomorrow),
    },
    {
      key: "weekend",
      label: "This weekend",
      range: { from: sat, to: sun },
      sub: `${fmt(sat)} — ${format(sun, "d")}`,
    },
  ] as const;

  // Helpers to compare dates/ranges ignoring time
  const sameDate = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();

  const sameRange = (a?: DateRange, b?: DateRange) => {
    if (!a?.from || !b?.from) return false;
    const aTo = a.to ?? a.from;
    const bTo = b.to ?? b.from;
    return sameDate(a.from, b.from) && sameDate(aTo, bTo);
  };

  const activeQuick = picks.find((p) => sameRange(value, p.range))?.key ?? null;

  return (
    <div className="flex flex-row gap-6 px-6">
      <div className="flex min-h-full w-full flex-col gap-4 py-1">
        {picks.map((p) => {
          const isActive = activeQuick === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                onChange(isActive ? undefined : p.range);
              }}
              className={cn(
                "grow rounded-2xl border p-4 text-left transition-transform duration-150 active:scale-95",
                isActive ? "bg-accent/50 border-blue-500 ring-2 ring-blue-500" : "border-border"
              )}
            >
              <p className="font-semibold">{p.label}</p>
              <p className="text-muted-foreground text-sm">{p.sub}</p>
            </button>
          );
        })}
      </div>
      <div className="shrink-0 py-1.5">
        <DayPicker
          required
          animate
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from ?? today}
          weekStartsOn={1}
          classNames={{
            today: `text-blue-500 p-1`,
            selected: ``,
            range_start: "bg-black text-white rounded-l-full",
            range_end: "bg-black text-white rounded-r-full",
            range_middle: "bg-secondary text-foreground",
            chevron: `text-primary`,
            day: "font-medium",
          }}
        />
      </div>
    </div>
  );
}
