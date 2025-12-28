import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, format, isSaturday, isSunday, nextSaturday } from "date-fns";
import { cn } from "@/lib/utils";

interface WhenPanelProps {
  value?: DateRange;
  onChange: (range?: DateRange) => void;
}

function fmt(d: Date) {
  return format(d, "MMM d");
}

export default function WhenPanel({ value, onChange }: WhenPanelProps) {
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

