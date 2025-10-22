"use client";

import * as React from "react";
import { Camera, CheckCircle2, Settings, Star, Plus } from "lucide-react";
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
    <div className="h-[92px] w-[92px] rounded-[19px] bg-[#D9D9D9] border border-gray-300" />
);

export default function BusinessProfilePage(): React.JSX.Element {
    return (
        <>
            <main className="min-h-screen w-full flex items-start p-4 pb-20">
                <div className="w-full">
                    <section className="rounded-[35px] mt-4 bg-white shadow-sm p-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full bg-[#28B872] text-white font-semibold grid place-items-center">
                                    AB
                                </div>
                                <span className="absolute -bottom-1 left-8 h-5 w-5 rounded-full bg-white border border-gray-200 grid place-items-center">
                                    <Camera className="h-3 w-3 text-gray-600" />
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-[15px] text-gray-900">
                                        Abebe Balcha
                                    </span>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div className="text-[12px] text-[#919191]">
                                    abebebalch@email.com
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Star
                                    className="h-4 w-4 text-yellow-400"
                                    fill="currentColor"
                                />
                                <span className="text-[15px] font-medium text-gray-800">
                                    4.7
                                </span>
                            </div>
                        </div>
                    </section>
                    <section className="rounded-[12px] border border-gray-100 bg-white shadow-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[14px] font-semibold text-gray-800">
                                Business Information
                            </h3>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-8 rounded-[12px] bg-[#F5F2F2] text-[13px] gap-2 px-3 border-gray-100 hover:bg-gray-50"
                            >
                                <Settings className="h-4 w-4 text-gray-600" />
                                <span className="text-black ">Advanced</span>
                            </Button>
                        </div>
                        <div className="space-y-3">
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
                                <PillInput placeholder="" />
                            </div>

                            <div>
                                <Label>About Your Business</Label>
                                <textarea
                                    placeholder="Carlos is a naturalist guide born in the Amazon basin. His encyclopedic knowledge of rainforest ecology, combined with his ability to spot even the most elusive wildlife"
                                    rows={4}
                                    className="w-full h-auto px-4 py-2 rounded-xl shadow-lg text-[14px] placeholder:text-[#8E8E8E] border border-gray-300 focus-visible:ring-emerald-100 focus-visible:ring-2 focus-visible:border-emerald-500 resize-none"
                                />
                            </div>

                            <div>
                                <Label>Specialties</Label>
                                <PillInput placeholder="Cultural Tours, Temple Visits" />
                            </div>
                        </div>
                    </section>
                    <div className="mt-6 px-4">
                        <Label>Business License</Label>
                        <div className="flex items-center gap-3">
                            <UploadSlot />
                            <UploadSlot />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-auto p-0 text-emerald-600 text-[14px] font-medium hover:bg-transparent"
                            >
                                <span className="h-6 w-6 rounded-full bg-[#28B872] text-white inline-grid place-items-center mr-2">
                                    <Plus className="h-4 w-4" />
                                </span>
                                Add more
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="h-auto p-0 text-emerald-600 text-[14px] font-medium hover:bg-transparent"
                            >
                                <span className="h-6 w-6 rounded-full bg-[#28B872] text-white inline-grid place-items-center mr-2">
                                    <Plus className="h-4 w-4" />
                                </span>
                                Add more
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
