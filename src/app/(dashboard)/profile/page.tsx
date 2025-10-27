"use client";

import * as React from "react";
import {
    Camera,
    CheckCircle2,
    Settings,
    Star,
    Plus,
    ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter for the back button
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Tourguidecomponents/TourGuideNavbar"; // Assuming this is kept
// NOTE: I've added a mock router for the back button to compile,
// replace with actual Next.js hook if you use this component directly.

// Re-using helper components for form consistency
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-[13px] font-medium text-gray-700 mb-1">
        {children}
    </label>
);

type PillInputProps = React.ComponentProps<typeof Input> & {
    rightAddon?: React.ReactNode;
};
function PillInput({ rightAddon, className, ...rest }: PillInputProps) {
    return (
        <div className="relative">
            <Input
                {...rest}
                className={[
                    "h-10 px-4 rounded-full shadow-lg text-[14px] placeholder:text-[#8E8E8E]",
                    "focus-visible:ring-emerald-100 focus-visible:ring-2 focus-visible:border-emerald-500",
                    className ?? "",
                ].join(" ")}
            />
            {rightAddon ? (
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-[13px]">
                    {rightAddon}
                </span>
            ) : null}
        </div>
    );
}

const UploadSlot: React.FC = () => (
    <div className="h-[92px] w-[92px] rounded-[19px] bg-[#D9D9D9] border border-gray-300 flex items-center justify-center">
        {/* Optional: Add an icon to indicate upload area */}
        <Plus className="h-6 w-6 text-gray-500" />
    </div>
);

export default function BusinessProfilePage(): React.JSX.Element {
    // Mock useRouter for a standalone component example
    const mockRouter = {
        push: (path: string) => console.log(`Navigating to ${path}`),
        back: () => console.log("Go back"),
    };
    const router =
        typeof window !== "undefined"
            ? require("next/navigation").useRouter()
            : mockRouter;

    return (
        // 1. Adopt min-h-screen bg-white from the first component
        <div
            className="min-h-screen bg-white pb-20"
            // Optional: Keep the custom font style if desired
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            {/* 2. Adopt max-w-xl mx-auto for centered container */}
            <div className="max-w-xl mx-auto p-4">
                {/* Header Section (Back Button + Title) */}
                <div className="flex flex-col items-center pt-4 mb-6">
                    <div className="w-full flex justify-start mb-6">
                        <button
                            onClick={() => router.back()} // Changed to router.back() for profile flow
                            aria-label="Back"
                            className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#ECECEC] shadow-[0_2px_6px_rgba(0,0,0,0.05)] active:scale-95 transition"
                        >
                            <ArrowLeft size={20} className="text-[#28B872]" />
                        </button>
                    </div>

                    {/* Business Info Header - Similar to the user profile area */}
                    <section className="w-full rounded-[25px] bg-white p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="relative mt-1">
                                <div className="h-14 w-14 rounded-full bg-[#28B872] text-white font-semibold grid place-items-center text-xl">
                                    AB
                                </div>
                                <span className="absolute -bottom-1 left-9 h-6 w-6 rounded-full bg-white border border-gray-200 grid place-items-center shadow-md cursor-pointer">
                                    <Camera className="h-3 w-3 text-gray-600" />
                                </span>
                            </div>

                            <div className="flex-1 mt-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-xl font-bold text-gray-900">
                                        Golden Tour
                                    </span>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="text-gray-500 text-sm mb-1">
                                    Abebe Balcha (Operator)
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star
                                        className="h-4 w-4 text-yellow-400"
                                        fill="currentColor"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        4.7 (25 Reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="h-8 rounded-[12px] bg-[#F5F2F2] text-[13px] gap-2 px-3 border-gray-100 hover:bg-gray-50 flex-shrink-0 mt-1"
                            >
                                <Settings className="h-4 w-4 text-gray-600" />
                                <span className="text-black font-semibold">
                                    Edit
                                </span>
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Information Forms Section */}
                {/* Increased padding and shadow for the main content block for better separation */}
                <section className="rounded-3xl border border-gray-100 bg-white shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-800">
                            Business Details
                        </h3>

                        {/* Moved Advanced Button here for context */}
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-xl bg-[#E6F8EF] text-sm gap-2 px-4 border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="font-semibold">Advanced</span>
                        </Button>
                    </div>

                    <div className="space-y-5">
                        {" "}
                        {/* Increased spacing for better readability */}
                        <div>
                            <Label>Business Name</Label>
                            <PillInput placeholder="Golden Tour" />
                        </div>
                        <div>
                            <Label>Operator Name</Label>
                            <PillInput placeholder="Abebe Balcha" />
                        </div>
                        <div>
                            <Label>Email Address</Label>
                            <PillInput
                                placeholder="abebe@gmail.com"
                                type="email"
                            />
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <PillInput
                                placeholder="+251999999999"
                                inputMode="tel"
                            />
                        </div>
                        <div>
                            <Label>Business Location</Label>
                            <PillInput placeholder="Addis Ababa, Bole" />
                        </div>
                        <div>
                            <Label>About Your Business</Label>
                            <textarea
                                placeholder="Carlos is a naturalist guide born in the Amazon basin. His encyclopedic knowledge of rainforest ecology, combined with his ability to spot even the most elusive wildlife"
                                rows={4}
                                // Adjusted styling for the textarea to match PillInput look
                                className="w-full h-auto px-4 py-3 rounded-2xl shadow-lg text-[14px] placeholder:text-[#8E8E8E] border border-gray-300 focus-visible:ring-emerald-100 focus-visible:ring-2 focus-visible:border-emerald-500 resize-none transition"
                            />
                        </div>
                        <div>
                            <Label>Specialties</Label>
                            <PillInput placeholder="Cultural Tours, Temple Visits, Safari" />
                        </div>
                    </div>
                </section>

                {/* Business License Section - Extracted from the previous inline section */}
                <section className="rounded-3xl border border-gray-100 bg-white shadow-xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Business License & Documents
                    </h3>

                    <Label>Upload/View Documents</Label>
                    <div className="flex items-center gap-4">
                        {" "}
                        {/* Increased gap for cleaner look */}
                        <UploadSlot />
                        <UploadSlot />
                        {/* Add more upload button as a slot for better visual alignment */}
                        <button
                            type="button"
                            className="h-[92px] w-[92px] rounded-[19px] border-2 border-dashed border-gray-300 text-gray-500 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                        >
                            <Plus className="h-6 w-6" />
                            <span className="text-xs mt-1">Add Doc</span>
                        </button>
                    </div>

                    {/* Simplified/Cleaned Add More button(s) */}
                    {/* Removed duplicate "Add more" buttons for a cleaner UI; the slot above handles adding */}
                </section>

                {/* Save/Action Button */}
                <div className="w-full flex items-center justify-center p-4">
                    <Button
                        type="submit"
                        className="w-full max-w-xs h-12 rounded-full bg-[#28B872] text-white text-lg font-bold shadow-lg hover:bg-green-600 transition"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
