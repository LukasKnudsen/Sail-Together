import { cn } from "@/lib/utils";
import { useEffect, useReducer } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import type { ReactNode } from "react";

export interface SearchStep {
  id: string;
  label: string;
}

export interface SearchOption {
  id: string;
  label: string;
  description?: string;
  className?: string;
  color?: string;
}

export interface SearchBarConfig<TState extends Record<string, any>> {
  steps: SearchStep[];
  maxWidth?: string;
  ariaLabel?: string;
  initialState: TState;
  reducer: (state: TState, action: any) => TState;
  getTabLabel: (stepId: string, state: TState) => string;
  renderStepContent: (stepId: string, state: TState, dispatch: (action: any) => void) => ReactNode;
  canSearch: (state: TState) => boolean;
  onSearch?: (state: TState) => void;
}

interface SearchBarProps<TState extends Record<string, any>> {
  config: SearchBarConfig<TState>;
}

export default function SearchBar<TState extends Record<string, any>>({
  config,
}: SearchBarProps<TState>) {
  const [state, dispatch] = useReducer(config.reducer, config.initialState);
  const containerRef = useClickAway<HTMLDivElement>(() => {
    dispatch({ type: "CLOSE" });
  });

  
  const activeStep = config.steps[state.stepIndex as number];

  useEffect(() => {
    if (!state.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.isOpen]);

  const canSearch = config.canSearch(state);

  const handleSearch = () => {
    if (config.onSearch) {
      config.onSearch(state);
    }
    dispatch({ type: "CLOSE" });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative mx-auto flex w-full max-w-2xl flex-col items-center")}
    >
      <div
        role="tablist"
        aria-label={config.ariaLabel || "Search filters"}
        tabIndex={-1}
        className="grid w-full grid-cols-4 items-center gap-2 rounded-full bg-neutral-200 p-1.5"
      >
        {config.steps.map((step, i) => {
          const isTabActive = state.isOpen && state.stepIndex === i;
          const tabId = `tab-${step.id.toLowerCase()}`;
          const panelId = `panel-${step.id.toLowerCase()}`;
          const tabLabel = config.getTabLabel(step.id, state);

          return (
            <button
              key={step.id}
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
              {tabLabel}
            </button>
          );
        })}

        <button
          disabled={!canSearch}
          onClick={handleSearch}
          className="rounded-full bg-blue-500 px-3 py-1.5 text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {state.isOpen && (
        <div
          role="tabpanel"
          id={`panel-${activeStep.id.toLowerCase()}`}
          aria-labelledby={`tab-${activeStep.id.toLowerCase()}`}
          className="bg-card border-border absolute top-full z-40 mt-2 w-full overflow-hidden rounded-3xl border py-6 shadow-lg"
        >
            {config.renderStepContent(activeStep.id, state, dispatch)}
        </div>
      )}
    </div>
  );
}
