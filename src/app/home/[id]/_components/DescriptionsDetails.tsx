import { MapPin } from "lucide-react";

interface DescriptionDetailsProps {
  address: string;
  description: string;
}

export function DescriptionDetails({
  address,
  description,
}: DescriptionDetailsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-gray-500">
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">{address}</span>
      </div>
      <p className="leading-relaxed text-gray-700">{description}</p>
    </div>
  );
}
