"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyImage } from "@/types/property-detail";

interface ImagePreviewModalProps {
  images: PropertyImage[];
  title: string;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePreviewModal({
  images,
  title,
  initialIndex,
  isOpen,
  onClose,
}: ImagePreviewModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
  });
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isOpen && emblaApi) {
      emblaApi.scrollTo(initialIndex, true);
      setSelectedIndex(initialIndex);
    }
  }, [isOpen, initialIndex, emblaApi]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, emblaApi]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        aria-label="Close preview"
        className="absolute top-4 right-4 z-10 rounded-full p-2 text-white hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Carousel */}
      <div
        className="relative w-full max-w-5xl px-14"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={emblaRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {images.map((img) => (
              <div key={img.id} className="min-w-0 shrink-0 grow-0 basis-full">
                <div className="relative flex aspect-video items-center justify-center">
                  <img
                    src={img.url}
                    alt={title}
                    className="max-h-[75vh] w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev button */}
        <button
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Next button */}
        <button
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Counter */}
        <p className="mt-3 text-center text-sm text-white/60">
          {selectedIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
