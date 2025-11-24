import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldError } from "@/components/ui/field";
import { EVENT_TYPES } from "@/components/searchbar/SearchEvent";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import MapWithGeocoder from "@/components/map/MapWithGeocoder";
import type { Location } from "@/types/location";
import { useState } from "react";
import { createEvent } from "@/features/events/api";
import { mutate } from "swr";

type Currency = "DKK" | "EUR" | "USD";
export type CategorySlug =
  | "race"
  | "cruise"
  | "meetup"
  | "training"
  | "maintenance"
  | "party"
  | "meeting"
  | "open-day"
  | "charity"
  | "other";

type FormState = {
  title: string;
  description?: string;
  location: Location | null;
  categorySlug: CategorySlug | null;
  startDate: Date;
  endDate?: Date;
  priceKind: "free" | "paid" | null;
  priceAmount?: number;
  priceCurrency?: Currency;
  imageFile?: File | null;
};

const INITIAL_FORM_STATE: FormState = {
  title: "",
  description: undefined,
  location: null,
  categorySlug: null,
  startDate: new Date(),
  endDate: undefined,
  priceKind: null,
  priceAmount: undefined,
  priceCurrency: "DKK",
  imageFile: null,
};

export default function AddEventForm({ className, ...props }: React.ComponentProps<"form">) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Helper function to update form state
  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Helper to combine date and time into a Date object
  const combineDateTime = (dateStr: string, timeStr: string): Date => {
    if (!dateStr || !timeStr) return new Date();
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Format date/time for inputs
  const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];
  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setError(null);
    setTouched({});
  };

  // Mark field as touched
  const markTouched = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Validation
  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (!form.location) return "Location is required";
    if (!form.categorySlug) return "Category is required";
    if (!form.priceKind) return "Price kind is required";
    if (form.priceKind === "paid" && (!form.priceAmount || form.priceAmount <= 0)) {
      return "Price amount is required for paid events";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Mark all fields as touched for validation
    setTouched({
      title: true,
      location: true,
      categorySlug: true,
      priceKind: true,
      startDate: true,
      startTime: true,
      priceAmount: true,
    });

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // TypeScript doesn't know these are non-null after validation, but we've validated them
      await createEvent({
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        categorySlug: form.categorySlug!,
        location: {
          name: form.location!.name,
          address: form.location!.address,
          longitude: form.location!.longitude,
          latitude: form.location!.latitude,
        },
        priceKind: form.priceKind!,
        priceAmount: form.priceKind === "paid" ? form.priceAmount : undefined,
        priceCurrency: form.priceKind === "paid" ? form.priceCurrency : undefined,
      });

      // Invalidate and refetch events cache
      await mutate("events");

      // Reset form on success
      resetForm();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to create event");
      console.error("Error creating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={cn("flex w-full flex-col gap-8 py-4", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <Field>
        <FieldLabel htmlFor="title">What do you want to call this event?</FieldLabel>
        <Input
          id="title"
          type="text"
          placeholder="e.g. Evening sail, Marina party"
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">What should people know about this event?</FieldLabel>
        <FieldDescription>
          Tell people what's planned. Include details about the vibe, the route, skill level, or
          anything they should know before joining.
        </FieldDescription>
        <Input
          id="description"
          type="text"
          placeholder="Describe the event"
          value={form.description || ""}
          onChange={(e) => updateField("description", e.target.value || undefined)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="place">Where is your event taking place?</FieldLabel>
        <FieldDescription>
          Add the marina, harbor, or meeting point so sailors can find it on the map.
        </FieldDescription>

        <MapWithGeocoder
          value={
            form.location
              ? {
                  name: form.location.name,
                  address: form.location.address,
                  longitude: form.location.longitude,
                  latitude: form.location.latitude,
                }
              : null
          }
          onLocationSelect={(locationData) => {
            updateField("location", {
              id: "",
              ...locationData,
            });
          }}
        />

        {!form.location && (
          <FieldError errors={[{ message: "Please select a location on the map" }]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="category">What type of event are you hosting?</FieldLabel>
        <Input id="category" type="hidden" value={form.categorySlug || ""} />
        <div className="grid grid-cols-3 gap-4">
          {EVENT_TYPES.map((event) => (
            <Button
              key={event.id}
              type="button"
              variant={form.categorySlug === event.id ? "default" : "outline"}
              className="py-8"
              onClick={() => updateField("categorySlug", event.id as CategorySlug)}
            >
              {event.label}
            </Button>
          ))}
        </div>
        {!form.categorySlug && <FieldError errors={[{ message: "Please select an event type" }]} />}
      </Field>

      <div>
        <p className="mb-3 text-sm font-medium">When does your event start?</p>
        <div className="flex flex-row items-end gap-4">
          <Field>
            <FieldLabel htmlFor="startDate">Date</FieldLabel>
            <Input
              id="startDate"
              type="date"
              required
              value={formatDateForInput(form.startDate)}
              onChange={(e) => {
                markTouched("startDate");
                const timeStr = formatTimeForInput(form.startDate);
                updateField("startDate", combineDateTime(e.target.value, timeStr));
              }}
              onBlur={() => markTouched("startDate")}
            />
            {touched.startDate && !formatDateForInput(form.startDate) && (
              <FieldError errors={[{ message: "Start date is required" }]} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="startTime">Time</FieldLabel>
            <Input
              id="startTime"
              required
              type="time"
              value={formatTimeForInput(form.startDate)}
              onChange={(e) => {
                markTouched("startTime");
                const dateStr = formatDateForInput(form.startDate);
                updateField("startDate", combineDateTime(dateStr, e.target.value));
              }}
              onBlur={() => markTouched("startTime")}
            />
            {touched.startTime && !formatTimeForInput(form.startDate) && (
              <FieldError errors={[{ message: "Start time is required" }]} />
            )}
          </Field>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">When does your event end? (Optional)</p>
        <div className="flex flex-row items-end gap-4">
          <Field>
            <FieldLabel htmlFor="endDate">Date</FieldLabel>
            <Input
              id="endDate"
              type="date"
              value={form.endDate ? formatDateForInput(form.endDate) : ""}
              onChange={(e) => {
                if (!e.target.value) {
                  updateField("endDate", undefined);
                  return;
                }
                const timeStr = form.endDate ? formatTimeForInput(form.endDate) : "00:00";
                updateField("endDate", combineDateTime(e.target.value, timeStr));
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="endTime">Time</FieldLabel>
            <Input
              id="endTime"
              type="time"
              value={form.endDate ? formatTimeForInput(form.endDate) : "00:00"}
              onChange={(e) => {
                if (!form.endDate) {
                  const dateStr = formatDateForInput(form.startDate);
                  updateField("endDate", combineDateTime(dateStr, e.target.value));
                  return;
                }
                const dateStr = formatDateForInput(form.endDate);
                updateField("endDate", combineDateTime(dateStr, e.target.value));
              }}
            />
          </Field>
        </div>
      </div>

      <Field>
        <FieldLabel>What's the pricing for your event?</FieldLabel>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={form.priceKind === "paid" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              updateField("priceKind", "paid");
              // Don't set priceAmount to 0, leave it undefined until user enters a value
            }}
          >
            Paid
          </Button>
          <Button
            type="button"
            variant={form.priceKind === "free" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              updateField("priceKind", "free");
              updateField("priceAmount", undefined);
            }}
          >
            Free
          </Button>
        </div>
        {!form.priceKind && <FieldError errors={[{ message: "Please select pricing type" }]} />}
      </Field>

      {form.priceKind === "paid" && (
        <>
          <Field>
            <FieldLabel htmlFor="priceAmount">Price Amount</FieldLabel>
            <Input
              id="priceAmount"
              type="number"
              step="1"
              min="1"
              placeholder="1"
              required
              value={form.priceAmount || ""}
              onChange={(e) => {
                markTouched("priceAmount");
                updateField("priceAmount", e.target.value ? Number(e.target.value) : undefined);
              }}
              onBlur={() => markTouched("priceAmount")}
            />
            {touched.priceAmount &&
              form.priceKind === "paid" &&
              (!form.priceAmount || form.priceAmount <= 0) && (
                <FieldError errors={[{ message: "Please enter a valid price amount" }]} />
              )}
          </Field>

          <Field>
            <FieldLabel htmlFor="priceCurrency">Currency</FieldLabel>
            <NativeSelect
              id="priceCurrency"
              value={form.priceCurrency || "DKK"}
              onChange={(e) => updateField("priceCurrency", e.target.value as Currency)}
            >
              <NativeSelectOption value="DKK">DKK</NativeSelectOption>
              <NativeSelectOption value="EUR">EUR</NativeSelectOption>
              <NativeSelectOption value="USD">USD</NativeSelectOption>
            </NativeSelect>
          </Field>
        </>
      )}

      <Field>
        <FieldLabel htmlFor="image">Add a few photos of your event (Optional)</FieldLabel>
        <FieldDescription>
          A few images of the boat or location make your listing stand out. You can add more or make
          changes later.
        </FieldDescription>
        <Input
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          className="border-2 border-dashed"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            updateField("imageFile", file);
          }}
        />
      </Field>

      {error && (
        <div
          role="alert"
          className="bg-destructive/10 text-destructive border-destructive/20 rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" size="lg" className="flex-1" variant="secondary" onClick={resetForm}>
          Cancel
        </Button>

        <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
