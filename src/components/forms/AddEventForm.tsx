import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldError } from "@/components/ui/field";
import MapWithGeocoder from "@/components/map/MapWithGeocoder";
import type { Location } from "@/types/location";
import { useState } from "react";
import { createEvent } from "@/features/events/api";
import { mutate } from "swr";
import DateTimePicker from "./DateTimePicker";
import CategorySelector from "./CategorySelector";
import PriceSelector from "./PriceSelector";
import type { Currency } from "@/types/event";
import type { CategorySlug } from "@/types/category";

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

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setError(null);
    setTouched({});
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
          onLocationSelect={(locationData) => updateField("location", { id: "", ...locationData })}
        />

        {!form.location && (
          <FieldError errors={[{ message: "Please select a location on the map" }]} />
        )}
      </Field>

      <CategorySelector
        value={form.categorySlug}
        onChange={(value) => updateField("categorySlug", value)}
      />

      <DateTimePicker
        label="When does your event start?"
        dateValue={form.startDate}
        timeValue={form.startDate}
        onDateChange={(date) => updateField("startDate", date || form.startDate)}
        onTimeChange={(date) => updateField("startDate", date || form.startDate)}
        dateId="startDate"
        timeId="startTime"
        required
        touched={touched.startDate || touched.startTime}
      />

      <DateTimePicker
        label="When does your event end? (Optional)"
        dateValue={form.endDate}
        timeValue={form.endDate}
        onDateChange={(date) => updateField("endDate", date || undefined)}
        onTimeChange={(date) => updateField("endDate", date || undefined)}
        dateId="endDate"
        timeId="endTime"
      />

      <PriceSelector
        priceKind={form.priceKind}
        priceAmount={form.priceAmount}
        priceCurrency={form.priceCurrency}
        onPriceKindChange={(kind) => updateField("priceKind", kind)}
        onPriceAmountChange={(amount) => updateField("priceAmount", amount)}
        onCurrencyChange={(currency) => updateField("priceCurrency", currency)}
        touched={touched.priceAmount}
      />

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
