interface EventCardPlaceholderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function EventCardPlaceholder({
  title,
  description = "Description",
  className,
}: EventCardPlaceholderProps) {
  return (
    <div className={`flex aspect-square w-full flex-col gap-2 ${className}`}>
      <div className="bg-muted size-full rounded-3xl" />
      <div className="px-1 leading-none">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

