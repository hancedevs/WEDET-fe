"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageIndicator } from "../ui/page-indicator";
import { ONBOARDING_STEPS } from "@/lib/utils";
import type { OnboardingStep } from "@/types/type";
import type { Variants } from "framer-motion";

export function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const router = useRouter();

    const currentData: OnboardingStep = ONBOARDING_STEPS[currentStep];

    const handleContinue = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        } else {
            router.push("/auth/login");
        }
    };

    const handleSkip = () => {
        router.push("/auth/login");
    };

    const slideVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeIn",
            },
        }),
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                ease: "easeOut",
                duration: 0.4,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                ease: "easeIn",
                duration: 0.3,
            },
        },
    };

    return (
        <div className="min-h-screen bg-white flex flex-col max-w-[400px] mx-auto">
            {/* Skip Button */}
            <div className="flex justify-end p-4">
                <motion.button
                    onClick={handleSkip}
                    className="text-gray-600 text-sm font-normal hover:text-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Skip
                </motion.button>
            </div>

            {/* Animated Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full flex flex-col items-center"
                    >
                        <motion.div
                            className="w-full max-w-[280px] mb-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={itemVariants}>
                                <Image
                                    src={
                                        currentData.image || "/placeholder.svg"
                                    }
                                    alt={currentData.title}
                                    width={280}
                                    height={280}
                                    className="w-full h-auto"
                                    priority
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.h2
                                className="text-xl font-bold text-gray-900 mb-6"
                                variants={itemVariants}
                            >
                                {currentData.title}
                            </motion.h2>
                            <motion.p
                                className="text-gray-600 text-sm leading-relaxed mb-16 px-4"
                                variants={itemVariants}
                            >
                                {currentData.description}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Page Indicator & Continue Button */}
            <div className="px-6 pb-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <PageIndicator
                        totalSteps={ONBOARDING_STEPS.length}
                        currentStep={currentStep}
                        className="mb-8"
                    />
                </motion.div>

                <div className="flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            onClick={handleContinue}
                            className="w-64 bg-green-500 hover:bg-green-600 text-white rounded-full py-2"
                        >
                            {currentStep === ONBOARDING_STEPS.length - 1
                                ? "Get Started"
                                : "Continue"}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
