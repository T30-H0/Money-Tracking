"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyImage } from "@/types/property-detail";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        {/* Main carousel */}
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          title="Click to preview"
        >
          <div className="flex">
            {images.map((img) => (
              <div key={img.id} className="min-w-0 shrink-0 grow-0 basis-full">
                <div className="relative aspect-[4/3]">
                  <img
                    src={img.url}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev button */}
        <button
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            emblaApi?.scrollPrev();
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Next button */}
        <button
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            emblaApi?.scrollNext();
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Navigation dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === selectedIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/60 hover:bg-white/80"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                emblaApi?.scrollTo(i);
              }}
            />
          ))}
        </div>
      </div>

      <ImagePreviewModal
        images={images}
        title={title}
        initialIndex={selectedIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
