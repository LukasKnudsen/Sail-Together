import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Label } from "./label";
import { useMemo } from "react";

const fieldVariants = cva("gap-3 w-full flex data-[invalid=true]:text-destructive", {
  variants: {
    orientation: {
      vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
      horizontal: ["flex-row items-center"],
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label group-data-[disabled=true]/field:opacity-50",
        "*:data-[slot=field]:p-4",
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-muted-foreground text-sm leading-normal font-normal", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & { errors?: Array<{ message?: string }> }) {
  const content = useMemo(() => {
    if (children) return children;

    if (!errors?.length) return null;

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, i) => error?.message && <li key={i}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export { Field, FieldLabel, FieldDescription, FieldError };
