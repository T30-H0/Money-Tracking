"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface ReadMoreTextProps {
  text: string;
  numberOfLines?: number;
  className?: string;
}

export function ReadMoreText({
  text,
  numberOfLines = 3,
  className = "leading-relaxed text-gray-700",
}: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkTruncation = () => {
      if (!isExpanded) {
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    };

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);
    checkTruncation();

    return () => observer.disconnect();
  }, [text, isExpanded]);

  const clampStyle = !isExpanded
    ? {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical" as const,
        WebkitLineClamp: numberOfLines,
        overflow: "hidden",
      }
    : undefined;

  return (
    <div
      className={cn("cursor-pointer", className)}
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      <p ref={textRef} style={clampStyle}>
        {text}
      </p>

      {(isTruncated || isExpanded) && (
        <button
          type="button"
          className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
