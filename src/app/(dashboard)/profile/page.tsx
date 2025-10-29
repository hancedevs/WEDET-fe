"use client";

import * as React from "react";
import {
    Camera,
    CheckCircle2,
    Settings,
    Star,
    Plus,
    ArrowLeft,
    LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Tourguidecomponents/TourGuideNavbar";

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
        <Plus className="h-6 w-6 text-gray-500" />
    </div>
);

export default function BusinessProfilePage(): React.JSX.Element {
    const router = useRouter();
    const handleLogout = async () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to log out?"
        );
        if (confirmLogout) {
            alert("Logged out successfully!");
            router.replace("/auth/login");
        }
    };

    return (
        <div
            className="min-h-screen bg-white pb-20"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            <div className="max-w-xl mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.back()}
                        aria-label="Back"
                        className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#ECECEC] shadow-[0_2px_6px_rgba(0,0,0,0.05)] active:scale-95 transition"
                    >
                        <ArrowLeft size={20} className="text-[#28B872]" />
                    </button>

                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="h-9 rounded-full bg-[#FFEFEF] text-red-600 border border-red-100 hover:bg-red-50 flex items-center gap-2 text-sm font-semibold transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

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

                <section className="rounded-3xl border border-gray-100 bg-white shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-800">
                            Business Details
                        </h3>
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
                                placeholder="Carlos is a naturalist guide born in the Amazon basin..."
                                rows={4}
                                className="w-full h-auto px-4 py-3 rounded-2xl shadow-lg text-[14px] placeholder:text-[#8E8E8E] border border-gray-300 focus-visible:ring-emerald-100 focus-visible:ring-2 focus-visible:border-emerald-500 resize-none transition"
                            />
                        </div>
                        <div>
                            <Label>Specialties</Label>
                            <PillInput placeholder="Cultural Tours, Temple Visits, Safari" />
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white shadow-xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Business License & Documents
                    </h3>
                    <Label>Upload/View Documents</Label>
                    <div className="flex items-center gap-4">
                        <UploadSlot />
                        <UploadSlot />
                        <button
                            type="button"
                            className="h-[92px] w-[92px] rounded-[19px] border-2 border-dashed border-gray-300 text-gray-500 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                        >
                            <Plus className="h-6 w-6" />
                            <span className="text-xs mt-1">Add Doc</span>
                        </button>
                    </div>
                </section>

                <div className="w-full flex items-center justify-center p-4 gap-5">
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
