"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PageIndicator } from "../ui/page-indicator";
import { ONBOARDING_STEPS } from "@/lib/utils";
import type { OnboardingStep } from "@/app/types/type";

export function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const currentData: OnboardingStep = ONBOARDING_STEPS[currentStep];

  const handleContinue = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/auth/signup");
    }
  };

  const handleSkip = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[400px] mx-auto">
      {/* Header with Skip button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-gray-600 text-sm font-normal hover:text-gray-800 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Centered illustration */}
        <div className="w-full max-w-[280px] mb-8">
          <Image
            src={currentData.image || "/placeholder.svg"}
            alt={currentData.title}
            width={280}
            height={280}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Bold title text */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {currentData.title}
        </h2>

        {/* Description paragraph */}
        <p className="text-gray-600 text-center text-sm leading-relaxed mb-16 px-4">
          {currentData.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8">
        {/* Page indicator dots */}
        <PageIndicator
          totalSteps={ONBOARDING_STEPS.length}
          currentStep={currentStep}
          className="mb-8"
        />

        {/* Continue button */}
      <div className="flex justify-center">
  <Button
    onClick={handleContinue}
    className="w-64 bg-green-500 hover:bg-green-600 text-white rounded-full py-2"
  >
    {currentStep === ONBOARDING_STEPS.length - 1
      ? "Get Started"
      : "Continue"}
  </Button>
</div>
      </div>
    </div>
  );
}
