"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import type { PropertyCardProps } from "@/types/property-card";
import Link from "next/link";

export function PropertyCard({
  id,
  imageUrl,
  isFavorite: initialIsFavorite = false,
  title,
  description,
  rating,
  address,
  price,
  onFavoriteToggle,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !isFavorite;
    setIsFavorite(next);
    onFavoriteToggle?.(next);
  };

  return (
    <Link
      href={`/home/${id}`}
      className="group flex w-full cursor-pointer flex-col gap-2"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />

        {/* Favorite toggle */}
        <button
          onClick={toggleFavorite}
          className="absolute right-3 top-3 rounded-full p-1 transition-transform active:scale-90"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartSolid className="h-6 w-6 text-red-500 drop-shadow-md" />
          ) : (
            <HeartOutline className="h-6 w-6 text-white drop-shadow-md" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="mt-1 flex flex-col gap-0.5">
        <div className="flex items-start justify-between">
          <h3 className="truncate text-sm font-semibold leading-tight text-gray-900">
            {address}
          </h3>
          <div className="ml-4 flex shrink-0 items-center gap-1">
            <StarIcon className="h-3.5 w-3.5 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">
              {rating.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="truncate text-sm text-gray-500 hover:font-semibold hover:text-black">
          {title}
        </p>
        <p className="line-clamp-1 text-sm text-gray-500 hover:font-semibold hover:text-black">
          {description}
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-semibold text-gray-900">${price}</span>
          <span className="text-sm text-gray-500">/night</span>
        </div>
      </div>
    </Link>
  );
}
