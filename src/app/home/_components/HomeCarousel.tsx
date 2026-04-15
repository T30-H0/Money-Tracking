"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { mockProperties } from "@/themes/home-data";

export default function HomeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const updateActiveIndex = () => {
      const slide = track.firstElementChild as HTMLElement | null;

      if (!slide) {
        return;
      }

      const slideWidth = slide.offsetWidth + 16;
      const nextIndex = Math.round(track.scrollLeft / slideWidth);
      setActiveIndex(Math.min(nextIndex, mockProperties.length - 1));
    };

    updateActiveIndex();
    track.addEventListener("scroll", updateActiveIndex, { passive: true });

    return () => {
      track.removeEventListener("scroll", updateActiveIndex);
    };
  }, []);

  const scrollBySlide = (direction: "previous" | "next") => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slide = track.firstElementChild as HTMLElement | null;
    const slideWidth = slide ? slide.offsetWidth + 16 : track.clientWidth;
    const offset = direction === "next" ? slideWidth : -slideWidth;

    track.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
            Featured escapes
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            Scroll through standout stays
          </h1>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBySlide("previous")}
            className="rounded-full border border-gray-200 bg-white p-3 text-gray-700 transition hover:border-gray-300 hover:text-gray-950"
            aria-label="Show previous property"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBySlide("next")}
            className="rounded-full border border-gray-200 bg-white p-3 text-gray-700 transition hover:border-gray-300 hover:text-gray-950"
            aria-label="Show next property"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
        aria-label="Featured properties carousel"
      >
        {mockProperties.map((property) => (
          <article
            key={property.id}
            className="group relative min-w-[85%] snap-start overflow-hidden rounded-[28px] bg-gray-900 sm:min-w-[65%] lg:min-w-[48%] xl:min-w-[40%]"
          >
            <div className="relative h-[420px] w-full">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 65vw, 40vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    {property.address}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {property.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm">
                  <StarIcon className="h-4 w-4" />
                  <span>{property.rating.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                  {property.description}
                </p>
                <p className="shrink-0 text-lg font-semibold text-white sm:text-xl">
                  ${property.price}
                  <span className="ml-1 text-sm font-medium text-white/70">
                    night
                  </span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {mockProperties.map((property, index) => (
          <button
            key={property.id}
            type="button"
            onClick={() => {
              const track = trackRef.current;

              if (!track) {
                return;
              }

              const slide = track.children[index] as HTMLElement | undefined;
              slide?.scrollIntoView({ behavior: "smooth", inline: "start" });
            }}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-10 bg-gray-950" : "w-2.5 bg-gray-300"
            }`}
            aria-label={`Go to property ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
