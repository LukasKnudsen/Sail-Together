import { cn } from "@/lib/utils";
import * as React from "react";

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="container" className={cn("w-full", className)} {...props} />;
}

export { Container };
