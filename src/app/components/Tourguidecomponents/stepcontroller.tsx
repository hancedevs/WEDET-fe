'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type StepControllerProps = {
  prevHref?: string;
  nextHref?: string;
  /** disable Next button */
  canNext?: boolean;
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function StepController({
  prevHref,
  nextHref,
  canNext = true,
  className = '',
  onPrev,
  onNext,
}: StepControllerProps) {
  const router = useRouter();

  const goPrev = () => {
    if (onPrev) return onPrev();
    if (prevHref) return router.push(prevHref);
    router.back();
  };

  const goNext = () => {
    if (!canNext) return;
    if (onNext) return onNext();
    if (nextHref) return router.push(nextHref);
  };

  return (
    <div className={'mt-6 flex items-center justify-between ' + className}>
      <button
        type="button"
        onClick={goPrev}
        className="inline-flex items-center gap-1 rounded-full border border-[#28B872] text-[#28B872] px-4 py-2 active:scale-95"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <button
        type="button"
        onClick={goNext}
        disabled={!canNext}
        className="inline-flex items-center gap-1 rounded-full bg-[#28B872] text-white px-5 py-2 disabled:opacity-50 active:scale-95"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
