"use client";

import { Bell } from "lucide-react";
import React from "react";

type ProgressHeaderProps = {
  title?: string;
  progress?: number;
  className?: string;
};

export default function ProgressHeader({
  title = "Trip post",
  progress = 0,
  className = "",
}: ProgressHeaderProps) {
  const pct = Math.max(0, Math.min(progress, 100));

  return (
    <header className={"bg-white/90 backdrop-blur  " + className}>
      <div className="flex items-center justify-between px-43  pt-4">
        <h1 className="text-sm font-semibold tracking-tight">{title}</h1>

        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-gray-100 active:scale-95"
        >
          <Bell className="w-5 h-5 text-gray-900" aria-hidden="true" />
        </button>
      </div>
      <div className="mx-auto max-w-[430px] px-4  flex items-center gap-3">
        <div className="flex-1 h-[6px] rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-[5px] bg-[#28B872]"
            style={{ width: `${pct}%` }}
            aria-label={`progress ${pct}%`}
          />
        </div>
      </div>
    </header>
  );
}
