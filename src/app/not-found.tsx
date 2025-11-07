"use client";

import Logo from "@/components/ui/Logo";
import { PlaneTakeoff } from "lucide-react";

export default function NotFound() {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-gray-50 to-[#e6f9f0] p-6"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="">
                        <Logo />
                    </div>
                </div>

                <h1 className="text-6xl font-extrabold text-[#28B872] mb-3">
                    404
                </h1>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Lost in the Wilderness!
                </h2>

                <p className="text-base text-gray-600 mb-8">
                    It looks like this page took an unexpected detour. We
                    couldn't find the destination you were looking for.
                </p>

                <a
                    href="/"
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-[#28B872] hover:bg-[#209f63] transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#28B872]/50"
                >
                    Back to Home Base
                </a>
            </div>
        </div>
    );
}
