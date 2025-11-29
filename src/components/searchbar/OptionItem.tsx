import { cn } from "@/lib/utils";

interface OptionItemProps {
  id: string;
  label: string;
  description?: string;
  className?: string;
  color?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export default function OptionItem({
  id,
  label,
  description,
  icon,
  className,
  color,
  onClick,
}: OptionItemProps) {
  return (
    <button
      key={id}
      type="button"
      tabIndex={0}
      className="hover:bg-secondary focus-visible:border-ring flex w-full flex-row gap-4 rounded-2xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      onClick={onClick}
    >
      <div className={cn("size-14 rounded-lg flex items-center justify-center", className, color)}>
        {icon}
      </div>
      <div className="flex flex-col justify-center text-sm font-medium">
        <p>{label}</p>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </button>
  );
}
