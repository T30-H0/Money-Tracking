"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface AmenitiesListProps {
  items: string[];
}

const MAX_VISIBLE = 14;

export function AmenitiesList({ items }: AmenitiesListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, MAX_VISIBLE);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Amenities</h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {visibleItems.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {items.length > MAX_VISIBLE && (
        <button
          className="self-start rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : `Show all ${items.length} amenities`}
        </button>
      )}
    </div>
  );
}
