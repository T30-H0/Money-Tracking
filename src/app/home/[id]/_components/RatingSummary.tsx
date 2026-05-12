"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Review } from "@/types/property-detail";
import { DetailedReviewsModal } from "./DetailedReviewsModal";

interface RatingSummaryProps {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

export function RatingSummary({
  rating,
  totalReviews,
  reviews,
}: RatingSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="flex w-full flex-col items-center gap-2 rounded-2xl border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
        onClick={() => setIsModalOpen(true)}
        aria-label="View all reviews"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
            <span className="text-4xl font-bold tracking-tight">{rating}</span>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-md py-2 text-gray-500">{totalReviews} reviews</p>
        <p className="text-xs font-medium text-gray-400 underline underline-offset-2">
          View all reviews
        </p>
      </button>

      <DetailedReviewsModal
        reviews={reviews}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
