import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { EVENT_TYPES } from "@/components/searchbar/SearchEvent";
import type { CategorySlug } from "@/types/category";

interface CategorySelectorProps {
  value: CategorySlug | null;
  onChange: (value: CategorySlug) => void;
}

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <Field>
      <FieldLabel htmlFor="category">What type of event are you hosting?</FieldLabel>
      <div className="grid grid-cols-3 gap-4">
        {EVENT_TYPES.map((event) => (
          <Button
            key={event.id}
            type="button"
            variant={value === event.id ? "default" : "outline"}
            className="py-8"
            onClick={() => onChange(event.id as CategorySlug)}
          >
            {event.label}
          </Button>
        ))}
      </div>
      {!value && <FieldError errors={[{ message: "Please select an event type" }]} />}
    </Field>
  );
}
