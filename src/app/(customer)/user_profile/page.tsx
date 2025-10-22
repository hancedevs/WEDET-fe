"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import NavBar from "@/components/ui/navBar";
import {
    ArrowLeft,
    Calendar,
    Bookmark,
    CreditCard,
    User,
    LogOut,
    KeyRound,
    HelpCircle,
    Settings,
    Edit2,
    Phone,
    Mail,
    Gift,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileOption {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color: string;
}

function UserProfileSkeleton() {
    return (
        <div
            className="min-h-screen bg-gray-50 pb-24"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            <div className="max-w-xl mx-auto p-4">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <div className="flex gap-4 border-t pt-3 mt-3">
                                <div className="flex flex-col items-center">
                                    <Skeleton className="h-5 w-10" />
                                    <Skeleton className="h-3 w-12 mt-1" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <Skeleton className="h-5 w-10" />
                                    <Skeleton className="h-3 w-12 mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100 space-y-3">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-4 border border-gray-100">
                    <Skeleton className="h-6 w-40 mb-2 border-b pb-2" />
                    <ul className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <li key={i} className="py-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-9 h-9 rounded-full" />
                                        <Skeleton className="h-5 w-40" />
                                    </div>
                                    <Skeleton className="w-4 h-4" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Skeleton className="w-full h-12 mt-8 rounded-xl" />
            </div>
            <NavBar />
        </div>
    );
}

export default function UserProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (!user || userError) {
                setLoading(false);
                router.push("/auth/login");
                return;
            }
            setUser(user);

            const { data: userProfile } = await supabase
                .from("users")
                .select(
                    "id, display_name, avatar_url, email, phone, gender, date_of_birth, created_at, bio"
                )
                .eq("id", user.id)
                .single();
            setProfile(userProfile);

            const { data: bookingsData } = await supabase
                .from("tours")
                .select("id")
                .eq("user_id", user.id);
            setBookings(bookingsData || []);

            const { data: wishlistData } = await supabase
                .from("wishlist")
                .select("id")
                .eq("user_id", user.id);
            setWishlist(wishlistData || []);

            setLoading(false);
        }
        fetchData();
    }, [router]);

    async function handleLogout() {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
            await supabase.auth.signOut();
            router.push("/auth/login");
        }
    }

    async function handleForgotPassword() {
        if (!user?.email) return;
        const { error } = await supabase.auth.resetPasswordForEmail(user.email);
        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            alert("Password reset link sent to your email.");
        }
    }

    const actionOptions: ProfileOption[] = [
        {
            label: "My Trips & Bookings",
            icon: <Calendar className="w-5 h-5" />,
            onClick: () => router.push("/wishlist"),
            color: "text-blue-500",
        },
        {
            label: "Saved Trips (Wishlist)",
            icon: <Bookmark className="w-5 h-5" />,
            onClick: () => router.push("/wishlist"),
            color: "text-purple-500",
        },
        {
            label: "Payment & Transactions",
            icon: <CreditCard className="w-5 h-5" />,
            onClick: () => console.log("Go to transactions"),
            color: "text-orange-500",
        },
        {
            label: "Change Password",
            icon: <KeyRound className="w-5 h-5" />,
            onClick: handleForgotPassword,
            color: "text-yellow-600",
        },
        {
            label: "Help Center & Support",
            icon: <HelpCircle className="w-5 h-5" />,
            onClick: () => console.log("Go to help center"),
            color: "text-cyan-500",
        },
        {
            label: "Refer a Friend",
            icon: <Gift className="w-5 h-5" />,
            onClick: () => console.log("Go to referrals"),
            color: "text-pink-500",
        },
    ];

    if (loading) {
        return <UserProfileSkeleton />;
    }

    return (
        <div
            className="min-h-screen bg-gray-50 pb-24"
            style={{ fontFamily: "'Century Gothic', sans-serif" }}
        >
            <div className="max-w-xl mx-auto p-4">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-gray-600 hover:text-[#28B872] transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => console.log("Go to settings")}
                        className="text-gray-600 hover:text-[#28B872] p-2 rounded-full transition"
                        aria-label="Settings"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.display_name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-[#28B872] shadow-md"
                                />
                            ) : (
                                <div className="rounded-full bg-[#28B872] text-white w-20 h-20 flex items-center justify-center text-3xl font-bold">
                                    <User className="w-10 h-10" />
                                </div>
                            )}
                            <button
                                className="absolute bottom-0 right-0 bg-[#e6f9f0] text-[#28B872] p-1.5 rounded-full shadow-md hover:bg-[#28B872] hover:text-white transition border border-white"
                                aria-label="Edit Profile"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-2xl font-bold text-gray-900 truncate">
                                {profile?.display_name ||
                                    profile?.email?.split("@")[0] ||
                                    "Traveler"}
                            </div>
                            <div className="text-gray-500 text-sm mb-3">
                                {profile?.bio ||
                                    `Joined: ${
                                        profile?.created_at?.slice(0, 10) ||
                                        "N/A"
                                    }`}
                            </div>

                            <div className="flex gap-4 border-t pt-3 mt-3">
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-xl text-gray-900 text-[#28B872]">
                                        {bookings.length}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Bookings
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-xl text-gray-900 text-[#28B872]">
                                        {wishlist.length}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Saved
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        Contact Details
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                            <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="font-medium">Email:</span>
                            <span className="ml-2 text-sm text-gray-500">
                                {profile?.email || "Not provided"}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="font-medium">Phone:</span>
                            <span className="ml-2 text-sm text-gray-500">
                                {profile?.phone || "Not provided"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-4 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">
                        Account Actions
                    </h2>
                    <ul className="divide-y divide-gray-100">
                        {actionOptions.map((option, index) => (
                            <li key={index}>
                                <button
                                    onClick={option.onClick}
                                    className="flex items-center justify-between w-full py-3 px-2 rounded-xl hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-2 rounded-full bg-opacity-10 ${option.color} bg-gray-100`}
                                        >
                                            {option.icon}
                                        </div>
                                        <span className="text-base text-gray-700">
                                            {option.label}
                                        </span>
                                    </div>
                                    <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-8 flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-green-50 text-green-600 font-semibold text-lg hover:bg-red-100 transition shadow-md"
                >
                    <LogOut className="w-6 h-6" /> Log Out
                </button>
            </div>
        </div>
    );
}
