import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";

import type { ProfileInfoItem } from "@/types/profile";

interface ProfileInfoListProps {
  items: ProfileInfoItem[];
}

const profileInfoIcons = {
  calendar: CalendarDays,
  email: Mail,
  location: MapPin,
  phone: Phone,
};

export function ProfileInfoList({ items }: ProfileInfoListProps) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = profileInfoIcons[item.icon];

        return (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-700">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase text-gray-500">
                {item.label}
              </dt>
              <dd className="mt-1 truncate text-sm font-medium text-gray-900">
                {item.value}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
