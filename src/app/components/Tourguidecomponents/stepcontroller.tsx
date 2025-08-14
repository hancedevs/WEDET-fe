"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconProps, StepControllerProps } from "@/app/types/type";

function CurvedLeftIcon({ size = 16, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.4 4.3 4.3 10.4a1.2 1.2 0 0 0 0 1.7l6.1 6.1a1.2 1.2 0 1 0 1.7-1.7L9.8 14H16c3.9 0 7 3.1 7 7a1.2 1.2 0 0 0 2.4 0C25.4 14.9 20.5 10 16 10H9.8l2.3-2.3a1.2 1.2 0 1 0-1.7-1.7Z" />
    </svg>
  );
}
function CurvedRightIcon({ size = 16, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <g transform="scale(-1,1) translate(-24,0)">
        <path d="M10.4 4.3 4.3 10.4a1.2 1.2 0 0 0 0 1.7l6.1 6.1a1.2 1.2 0 1 0 1.7-1.7L9.8 14H16c3.9 0 7 3.1 7 7a1.2 1.2 0 0 0 2.4 0C25.4 14.9 20.5 10 16 10H9.8l2.3-2.3a1.2 1.2 0 1 0-1.7-1.7Z" />
      </g>
    </svg>
  );
}

export default function StepController({
  prevHref,
  nextHref,
  showPrev = true,
  canPrev = true,
  canNext = true,
  submitMode = true,
  onPrev,
  onNext,
  className = "",
}: StepControllerProps & { submitMode?: boolean }) {
  const router = useRouter();

  const goPrev = () => {
    if (!canPrev) return;
    if (onPrev) return onPrev();
    if (prevHref) return router.push(prevHref);
    router.back();
  };

  const goNext = () => {
    if (!canNext) return;
    if (onNext) return onNext();
    if (nextHref) return router.push(nextHref);
  };

  const btn =
    "relative inline-flex items-center justify-center " +
    "h-9 md:h-10 w-[132px] md:w-[148px] rounded-full " +
    "bg-[#28B872] text-white text-sm font-medium " +
    "shadow-[0_4px_10px_rgba(0,0,0,0.16)] " +
    "hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={"mt-6 " + className}>
      <div
        className={
          "w-full flex items-center " +
          (showPrev ? "justify-between" : "justify-center")
        }
      >
        {showPrev && (
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            className={btn}
            aria-label="Previous"
          >
            <CurvedLeftIcon className="absolute left-3 md:left-4" />
            <span className="w-full text-center select-none">Previous</span>
          </button>
        )}

        {submitMode ? (
          <button
            type="submit"
            disabled={!canNext}
            className={btn}
            aria-label="Next"
          >
            <span className="w-full text-center select-none">Next</span>
            <CurvedRightIcon className="absolute right-3 md:right-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            className={btn}
            aria-label="Next"
          >
            <span className="w-full text-center select-none">Next</span>
            <CurvedRightIcon className="absolute right-3 md:right-4" />
          </button>
        )}
      </div>
    </div>
  );
}
