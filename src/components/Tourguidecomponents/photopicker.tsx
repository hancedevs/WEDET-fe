"use client";

import React, { useRef, ChangeEvent } from "react";

type Props = {
  value: string[];
  onChange: (arr: string[]) => void;
  error?: string;
  max?: number;
};

const VISIBLE_TILES = 3;

export default function PhotoPicker({
  value,
  onChange,
  error,
  max = 20,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const toDataUrls = async (files: FileList) => {
    const items = Array.from(files);
    const urls = await Promise.all(
      items.map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.readAsDataURL(f);
          })
      )
    );
    return urls;
  };

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = await toDataUrls(e.target.files);
    onChange([...value, ...picked].slice(0, max));
    e.target.value = ""; // allow re-picking the same files
  };

  const openPicker = () => fileRef.current?.click();

  // Ensure we always show up to 3 tiles; if fewer images, fill with add-tiles
  const remainingCapacity = Math.max(0, max - value.length);
  const addTiles = Math.min(
    Math.max(0, VISIBLE_TILES - value.length),
    remainingCapacity
  );
  const showScroll = value.length + addTiles > VISIBLE_TILES; // informational, overflow is enabled regardless

  return (
    <div>
      {/* Outer card */}
      <div
        className="
          rounded-3xl bg-white border border-[#F0F0F0]
          shadow-[0_6px_20px_rgba(0,0,0,0.08)] p-3
        "
      >
        {/* Horizontal strip */}
        <div
          className="
            flex flex-nowrap gap-3 overflow-x-auto overscroll-x-contain
            px-1
          "
          style={{ scrollSnapType: showScroll ? "x mandatory" : undefined }}
        >
          {/* Image tiles */}
          {value.map((src, i) => (
            <div
              key={i}
              className="
                relative shrink-0 w-[96px] h-[96px]
                rounded-2xl overflow-hidden
                bg-gray-100
              "
              style={{ scrollSnapAlign: "start" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`photo-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label="Remove photo"
                className="
                  absolute top-1.5 right-2 text-[#28B872]
                  text-xl leading-none font-bold
                  hover:scale-110 active:scale-95 transition
                "
              >
                ×
              </button>
            </div>
          ))}

          {/* Add tiles to complete up to 3 visible slots */}
          {Array.from({ length: addTiles }).map((_, k) => (
            <button
              key={`add-${k}`}
              type="button"
              onClick={openPicker}
              className="
                shrink-0 w-[96px] h-[96px] rounded-2xl
                border-2 border-dashed border-[#28B872]/60
                bg-[#F6FFFA] grid place-items-center
                hover:bg-[#F0FFF7] active:scale-95 transition
              "
              style={{ scrollSnapAlign: "start" }}
              aria-label="Add photos"
            >
              <ImagePlus className="w-9 h-9" />
            </button>
          ))}

          {/* If there’s still capacity beyond the first 3, show an extra add tile at the end */}
          {remainingCapacity > addTiles && (
            <button
              type="button"
              onClick={openPicker}
              className="
                shrink-0 w-[96px] h-[96px] rounded-2xl
                border-2 border-dashed border-[#28B872]/60
                bg-[#F6FFFA] grid place-items-center
                hover:bg-[#F0FFF7] active:scale-95 transition
              "
              aria-label="Add more photos"
            >
              <ImagePlus className="w-9 h-9" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onFiles}
      />

      {error && <div className="text-[11px] text-red-500 mt-1">{error}</div>}
    </div>
  );
}


function ImagePlus({ }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4cc274"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-image-plus-icon lucide-image-plus"
    >
      <path d="M16 5h6" />
      <path d="M19 2v6" />
      <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      <circle cx="9" cy="9" r="2" />
    </svg>
  );
}
