"use client";

import { useRef, ChangeEvent } from "react";

type Props = {
  value: string[];
  onChange: (arr: string[]) => void;
  error?: string;
};

export default function PhotoPicker({ value, onChange, error }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const toDataUrls = async (files: FileList) => {
    const arr = await Promise.all(
      Array.from(files).map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.readAsDataURL(f);
          })
      )
    );
    return arr;
  };

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = await toDataUrls(e.target.files);
    onChange([...value, ...picked].slice(0, 10));
  };

  return (
    <div>
      <div className="flex gap-3">
        {value.map((src, i) => (
          <div
            key={i}
            className="relative w-[88px] h-[62px] rounded-2xl overflow-hidden border-2 border-[#ECECEC]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="trip" className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-[#28B872] text-[#28B872] leading-none"
              onClick={() => onChange(value.filter((_, x) => x !== i))}
              aria-label="remove"
            >
              ×
            </button>
          </div>
        ))}

        {[0, 1].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => ref.current?.click()}
            className="w-[88px] h-[62px] rounded-2xl border-2 border-dashed border-[#28B872]/50 bg-[#F6FFFA] grid place-items-center"
          >
            <span className="text-[#28B872] text-xl">🖼️</span>
          </button>
        ))}
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onFiles}
      />

      {error ? (
        <div className="text-[11px] text-red-500 mt-1">{error}</div>
      ) : null}
    </div>
  );
}
