'use client';

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import ProgressHeader from "./ProgressHeader";
import TripSummary from "./TripSummary";
import StepControls from "./StepControls";
import { TripSummaryData } from "@/app/types/type";

interface Props {
  step: number;
  children: ReactNode;
  trip : TripSummaryData;
  onNext?: () => void;
  onPrev?: () => void;
  disableNext?: boolean;
}

export default function BookingStepLayout({
  step,
  children,
  trip,
  onNext,
  onPrev,
  disableNext,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-[calc(100vh-70px)]">
      {/* Top Header */}
      <ProgressHeader step={step} onBack={onPrev ?? (() => router.back())} />

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-6 mt-2">
        <TripSummary {...trip} />
        {children}
      </div>

      {/* Step Navigation */}
      <StepControls
        step={step}
        onNext={onNext}
        onPrev={onPrev}
        disableNext={disableNext}
      />
    </div>
  );
}
