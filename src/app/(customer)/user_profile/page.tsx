"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { BookingItem, ProfileOption } from "@/types/type";
import { getUserInfo } from "@/lib/utils";
import BookingsTab from "@/components/profile/BookingsTab";
import SettingsTab from "@/components/profile/SettingsTab";
import UserProfileSkeleton from "@/components/profile/UserProfileSkeleton";
import {
    ArrowLeft,
    Clock,
    Star,
    LayoutDashboard,
    Package,
    BarChart3,
    CalendarCheck,
} from "lucide-react";

const actionOptions: ProfileOption[] = [
    {
        label: "Travel History",
        icon: <Clock className="w-5 h-5" />,
        onClick: () => {},
        color: "text-green-500",
    },
    {
        label: "Luxury Daily Life",
        icon: <Star className="w-5 h-5" />,
        onClick: () => {},
        color: "text-amber-500",
    },
    {
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        onClick: () => {},
        color: "text-blue-500",
    },
    {
        label: "Products",
        icon: <Package className="w-5 h-5" />,
        onClick: () => {},
        color: "text-purple-500",
    },
    {
        label: "Analytics",
        icon: <BarChart3 className="w-5 h-5" />,
        onClick: () => {},
        color: "text-orange-500",
    },
    {
        label: "Schedule",
        icon: <CalendarCheck className="w-5 h-5" />,
        onClick: () => {},
        color: "text-red-500",
    },
];

export default function UserProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [bookingsCount, setBookingsCount] = useState<number>(0);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [activeTab, setActiveTab] = useState<"bookings" | "settings">(
        "bookings"
    );

    const router = useRouter();

    // --- Logout ---
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace("/home");
        } catch (err) {
            console.error("Logout error:", err);
            alert("Failed to log out. Try again.");
        }
    };

    useEffect(() => {
        const loadUserAndTickets = async () => {
            setLoadingProfile(true);
            setLoadingBookings(true);

            // 1️⃣ Get session
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
                router.replace("/auth/login");
                return;
            }

            // 2️⃣ Get user info
            const { data: userData, error: userError } =
                await supabase.auth.getUser();
            if (userError || !userData.user) {
                router.replace("/auth/login");
                return;
            }

            const userInfo = getUserInfo(userData.user);
            setProfile(userInfo);
            setLoadingProfile(false);

            // 3️⃣ Fetch tickets for this user
            const { data: ticketsData, error: ticketsError } = await supabase
                .from("tickets")
                .select("*")
                .eq("user_id", userData.user.id)
                .order("created_at", { ascending: false });

            if (ticketsError) {
                console.error("Error fetching tickets:", ticketsError);
            } else if (ticketsData) {
                setBookings(ticketsData as BookingItem[]);
                setBookingsCount(ticketsData.length);
            }

            setLoadingBookings(false);
        };

        void loadUserAndTickets();
    }, [router]);

    // Show full skeleton if profile is loading
    if (loadingProfile) return <UserProfileSkeleton />;

    return (
        <div className="min-h-screen bg-white pb-36 font-sans">
            <div className="max-w-xl mx-auto p-4">
                {/* Header */}
                <div className="flex flex-col items-center pt-4">
                    <div className="w-full flex justify-start mb-6">
                        <button
                            onClick={() => router.push("/home")}
                            aria-label="Back"
                            className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#ECECEC] shadow transition"
                        >
                            <ArrowLeft size={20} className="text-[#28B872]" />
                        </button>
                    </div>

                    {/* Avatar & Info */}
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
                                    {profile?.firstName?.[0]?.toUpperCase() ||
                                        "U"}
                                </div>
                            )}
                        </div>
                        <div className="text-xl font-bold text-gray-900">{`${
                            profile?.firstName || "Traveler"
                        } ${profile?.lastName || ""}`}</div>
                        <div className="text-gray-500 text-sm mb-4">
                            {profile?.email || "N/A"}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex w-full max-w-sm mx-auto bg-gray-100 p-1 rounded-full mb-6 shadow-inner">
                        <button
                            onClick={() => setActiveTab("bookings")}
                            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition ${
                                activeTab === "bookings"
                                    ? "bg-[#28B872] text-white shadow-md"
                                    : "text-gray-600 hover:text-[#28B872]"
                            }`}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition ${
                                activeTab === "settings"
                                    ? "bg-[#28B872] text-white shadow-md"
                                    : "text-gray-600 hover:text-[#28B872]"
                            }`}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === "bookings" ? (
                    loadingBookings ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-24 bg-gray-100 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <BookingsTab bookings={bookings} profile={profile} />
                    )
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
