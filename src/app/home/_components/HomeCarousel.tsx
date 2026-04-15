"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { mockProperties } from "@/themes/home-data";
import Image from "next/image";

export default function HomeCarousel() {
  return (
    <Carousel>
      <CarouselContent>
        {mockProperties.map((property) => (
          <CarouselItem key={property.id}>
            <div className="aspect-video relative w-full">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
