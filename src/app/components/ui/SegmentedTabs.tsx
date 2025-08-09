"use client";

import { TripStatus } from "@/app/types/type";
import clsx from "clsx";

const items: { label: string; value: TripStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Confirming", value: "confirming" },
  { label: "Wishlist", value: "wishlist" },
];

type Props = {
  value: TripStatus;
  onChange: (v: TripStatus) => void;
};

export default function SegmentedTabs({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Trip category"
      className={clsx(
        "w-full rounded-full bg-[#EAF5EF] p-1",
        "flex items-center gap-1 sm:gap-2 md:gap-3" //  tiny phones
      )}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.value)}
            className={clsx(
              "flex-1 basis-0 rounded-full font-semibold transition outline-none",
              "whitespace-nowrap",
              //  fit on small phones
              "h-8 px-2 text-[11px]",
              // on bigger screens
              "sm:h-9 sm:px-3 sm:text-[12px]",
              "md:h-10 md:px-4 md:text-sm",
              active
                ? "bg-[#28B872] text-white shadow-[0_2px_4px_rgba(40,184,114,0.35)]"
                : "text-[#5E5E5E] hover:bg-white",
              "focus-visible:ring-2 focus-visible:ring-[#28B872]/40"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
