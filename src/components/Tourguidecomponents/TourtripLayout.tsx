'use client';

import { Bell } from 'lucide-react';
import * as React from 'react';

type Props = {
  title: string;
  progress?: number; // 0–100
  children: React.ReactNode;
};

export default function TourtripLayout({ title, progress = 0, children }: Props) {
  const pct = Math.max(0, Math.min(100, progress));
  // total header height we reserve (title row + progress + paddings)
  const HEADER_H = 88; 

  return (
    <div className="min-h-screen bg-white">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#ECECEC] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div
          className="mx-auto max-w-[430px] px-4 pt-6 pb-3"
          
          style={{ paddingTop: 'max(1.25rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <button
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-gray-100 active:scale-95"
            >
              <Bell className="w-5 h-5 text-gray-900" aria-hidden="true" />
            </button>
          </div>

          {/* progress bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full bg-[#28B872] transition-[width] duration-300"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            />
          </div>
        </div>
      </header>

      {/* Spacer so content starts below fixed header */}
      <div style={{ height: `calc(${HEADER_H}px + env(safe-area-inset-top))` }} />

      {/* Content */}
      <main className="mx-auto max-w-[430px] px-4">{children}</main>
    </div>
  );
}
