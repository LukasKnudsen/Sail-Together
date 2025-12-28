import { cn } from "@/lib/utils";

export default function LoadingDots({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex space-x-1", className)} {...props}>
      <div
        className="bg-muted size-4 animate-bounce rounded-full"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="bg-muted size-4 animate-bounce rounded-full"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="bg-muted size-4 animate-bounce rounded-full"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
