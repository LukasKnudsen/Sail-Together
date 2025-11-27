import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { Currency } from "@/types/event";

interface PriceSelectorProps {
  priceKind: "free" | "paid" | null;
  priceAmount?: number;
  priceCurrency?: Currency;
  onPriceKindChange: (kind: "free" | "paid") => void;
  onPriceAmountChange: (amount: number | undefined) => void;
  onCurrencyChange: (currency: Currency) => void;
  touched?: boolean;
}

export default function PriceSelector({
  priceKind,
  priceAmount,
  priceCurrency,
  onPriceKindChange,
  onPriceAmountChange,
  onCurrencyChange,
  touched = false,
}: PriceSelectorProps) {
  return (
    <>
      <Field>
        <FieldLabel>What's the pricing for your event?</FieldLabel>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={priceKind === "paid" ? "default" : "outline"}
            className="py-8"
            onClick={() => onPriceKindChange("paid")}
          >
            Paid
          </Button>
          <Button
            type="button"
            variant={priceKind === "free" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              onPriceKindChange("free");
              onPriceAmountChange(undefined);
            }}
          >
            Free
          </Button>
        </div>
        {!priceKind && <FieldError errors={[{ message: "Please select pricing type" }]} />}
      </Field>

      {priceKind === "paid" && (
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
              value={priceAmount || ""}
              onChange={(e) => onPriceAmountChange(e.target.value ? Number(e.target.value) : undefined)}
            />
            {touched && priceKind === "paid" && (!priceAmount || priceAmount <= 0) && (
              <FieldError errors={[{ message: "Please enter a valid price amount" }]} />
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="priceCurrency">Currency</FieldLabel>
            <NativeSelect
              id="priceCurrency"
              value={priceCurrency || "DKK"}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            >
              <NativeSelectOption value="DKK">DKK</NativeSelectOption>
              <NativeSelectOption value="EUR">EUR</NativeSelectOption>
              <NativeSelectOption value="USD">USD</NativeSelectOption>
            </NativeSelect>
          </Field>
        </>
      )}
    </>
  );
}

