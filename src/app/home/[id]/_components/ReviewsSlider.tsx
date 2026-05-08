"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Review } from "@/types/property-detail";

interface ReviewsSliderProps {
  reviews: Review[];
}

export function ReviewsSlider({ reviews }: ReviewsSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <div className="flex gap-1">
          <button
            aria-label="Previous review"
            disabled={!canScrollPrev}
            className="rounded-full border p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next review"
            disabled={!canScrollNext}
            className="rounded-full border p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-0 shrink-0 grow-0 basis-full sm:basis-[calc(50%-8px)]"
            >
              <div className="flex h-full flex-col gap-3 rounded-xl border border-gray-200 p-4">
                {/* User info */}
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.user}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                      {review.user[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{review.user}</p>
                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(review.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="line-clamp-3 text-sm text-gray-600">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
