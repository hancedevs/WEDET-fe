"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import NavBar from "@/components/ui/navBar";
import {
    ArrowLeft,
    Clock,
    Star,
    LayoutDashboard,
    Package,
    BarChart3,
    CalendarCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookingItem, ProfileOption } from "@/types/type";
import { getUserInfo } from "@/lib/utils";
import { mockBookings } from "@/mock/data";
import UserProfileSkeleton from "@/components/profile/UserProfileSkeleton";
import BookingsTab from "@/components/profile/BookingsTab";
import SettingsTab from "@/components/profile/SettingsTab";

const actionOptions: ProfileOption[] = [
    {
        label: "Travel History",
        icon: <Clock className="w-5 h-5" />,
        onClick: () => console.log("Go to Travel History"),
        color: "text-green-500",
    },
    {
        label: "Luxury Daily Life",
        icon: <Star className="w-5 h-5" />,
        onClick: () => console.log("Go to Luxury Daily Life"),
        color: "text-amber-500",
    },
    {
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        onClick: () => console.log("Go to Dashboard"),
        color: "text-blue-500",
    },
    {
        label: "Products",
        icon: <Package className="w-5 h-5" />,
        onClick: () => console.log("Go to Products"),
        color: "text-purple-500",
    },
    {
        label: "Analytics",
        icon: <BarChart3 className="w-5 h-5" />,
        onClick: () => console.log("Go to Analytics"),
        color: "text-orange-500",
    },
    {
        label: "Schedule",
        icon: <CalendarCheck className="w-5 h-5" />,
        onClick: () => console.log("Go to Schedule"),
        color: "text-red-500",
    },
];

export default function UserProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [bookingsCount, setBookingsCount] = useState<number>(0);
    const [wishlistCount, setWishlistCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"bookings" | "settings">(
        "bookings"
    );

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Logout error:", error.message);
                alert("Failed to log out. Please try again.");
                return;
            }

            router.replace("/home");
        } catch (err) {
            console.error("Unexpected logout error:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                console.log("No session, redirecting to login");
                router.replace("/auth/login");
                return;
            }

            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("getUser error:", error.message);
                return;
            }

            const user = data.user;
            if (user) {
                const userInfo = getUserInfo(user);
                setProfile(userInfo);
            } else {
                await supabase.auth.signOut();
                router.replace("/auth/login");
            }
            setLoading(false);
        };

        void loadUser();
    }, [router]);

    if (loading) return <UserProfileSkeleton />;

    return (
        <div
            className="min-h-screen bg-white pb-36"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            <div className="max-w-xl mx-auto p-4">
                {/* Header Section */}
                <div className="flex flex-col items-center pt-4">
                    {/* Back Button */}
                    <div className="w-full flex justify-start mb-6">
                        <button
                            onClick={() => router.push("/home")}
                            aria-label="Back"
                            className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#ECECEC] shadow-[0_2px_6px_rgba(0,0,0,0.05)] active:scale-95 transition"
                        >
                            <ArrowLeft size={20} className="text-[#28B872]" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 mb-2">
                            {profile?.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#28B872] rounded-full flex items-center justify-center text-white font-extrabold text-2xl">
                                    <span className="font-sans">
                                        {profile?.firstName?.[0]?.toUpperCase() ||
                                            "U"}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                            {`${profile?.firstName || "Traveler"} ${
                                profile?.lastName || ""
                            }`}
                        </div>
                        <div className="text-gray-500 text-sm mb-4">
                            {profile?.email || "N/A"}
                        </div>
                    </div>

                    <div className="flex w-full max-w-sm mx-auto bg-gray-100 p-1 rounded-full mb-6 shadow-inner">
                        <button
                            onClick={() => setActiveTab("bookings")}
                            className={`flex-1 py-1.5 text-center text-sm font-semibold rounded-full transition ${
                                activeTab === "bookings"
                                    ? "bg-[#28B872] text-white shadow-md"
                                    : "text-gray-600 hover:text-[#28B872]"
                            }`}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex-1 py-1.5 text-center text-sm font-semibold rounded-full transition ${
                                activeTab === "settings"
                                    ? "bg-[#28B872] text-white shadow-md"
                                    : "text-gray-600 hover:text-[#28B872]"
                            }`}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {activeTab === "bookings" ? (
                    <BookingsTab bookings={mockBookings} profile={profile} />
                ) : (
                    <SettingsTab
                        profile={profile}
                        actionOptions={actionOptions.map((option) => {
                            if (option.label === "Travel History") {
                                return {
                                    ...option,
                                    label: `Travel History (${bookingsCount})`,
                                };
                            }
                            return option;
                        })}
                        handleLogout={handleLogout}
                    />
                )}
            </div>
        </div>
    );
}
