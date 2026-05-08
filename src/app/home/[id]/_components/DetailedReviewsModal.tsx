"use client";

import { Star, X } from "lucide-react";
import { Review } from "@/types/property-detail";

interface DetailedReviewsModalProps {
  reviews: Review[];
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedReviewsModal({
  reviews,
  isOpen,
  onClose,
}: DetailedReviewsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{reviews.length} Reviews</h2>
          <button
            aria-label="Close"
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reviews list */}
        <div className="flex flex-col divide-y overflow-y-auto px-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 py-6">
              {/* User row */}
              <div className="flex items-start gap-3">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.user}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                    {review.user[0]}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-semibold">{review.user}</p>
                  {review.datetime && (
                    <p className="text-xs text-gray-400">
                      {new Date(review.datetime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Rating badge */}
                <div className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(review.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-0.5 text-xs font-medium">
                    {review.rating}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <p className="text-sm leading-relaxed text-gray-700">
                {review.comment}
              </p>

              {/* User uploaded images */}
              {review.userImages && review.userImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {review.userImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Photo by ${review.user}`}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
