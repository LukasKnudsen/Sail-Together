import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { format } from "date-fns";

interface DateTimePickerProps {
  label: string;
  dateValue: Date | undefined;
  timeValue: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (date: Date | undefined) => void;
  dateId: string;
  timeId: string;
  required?: boolean;
  touched?: boolean;
}

export default function DateTimePicker({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateId,
  timeId,
  required = false,
  touched = false,
}: DateTimePickerProps) {
  const dateStr = dateValue ? format(dateValue, "yyyy-MM-dd") : "";
  const timeStr = timeValue ? format(timeValue, "HH:mm") : "00:00";

  const combineDateTime = (dateStr: string, timeStr: string): Date | undefined => {
    if (!dateStr) {
      // For optional fields, allow undefined
      if (!required) return undefined;
      // For required fields, use current date as fallback
      const now = new Date();
      return new Date(`${format(now, "yyyy-MM-dd")}T${timeStr || format(now, "HH:mm")}`);
    }
    return new Date(`${dateStr}T${timeStr || "00:00"}`);
  };

  return (
    <div>
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="flex flex-row items-end gap-4">
        <Field>
          <FieldLabel htmlFor={dateId}>Date</FieldLabel>
          <Input
            id={dateId}
            type="date"
            required={required}
            value={dateStr}
            onChange={(e) => {
              if (!e.target.value && !required) {
                onDateChange(undefined);
                return;
              }
              onDateChange(combineDateTime(e.target.value, timeStr));
            }}
          />
          {required && touched && !dateStr && (
            <FieldError errors={[{ message: `${label} date is required` }]} />
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor={timeId}>Time</FieldLabel>
          <Input
            id={timeId}
            type="time"
            required={required}
            value={timeStr}
            onChange={(e) => {
              if (!dateStr && !required) {
                // If no date is set and field is optional, don't update
                return;
              }
              const newDateStr = dateStr || format(new Date(), "yyyy-MM-dd");
              onTimeChange(combineDateTime(newDateStr, e.target.value));
            }}
          />
          {required && touched && !timeStr && (
            <FieldError errors={[{ message: `${label} time is required` }]} />
          )}
        </Field>
      </div>
    </div>
  );
}
