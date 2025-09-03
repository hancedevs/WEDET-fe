"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import NavBar from "@/app/components/ui/navBar";
import { ArrowLeft, Calendar, Bookmark, CreditCard, User, LogOut, KeyRound, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
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
      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        setLoading(false);
        return;
      }
      setUser(user);
      // Fetch profile from users table
      const { data: userProfile } = await supabase
        .from("users")
        .select("id, display_name, avatar_url, email, phone, gender, date_of_birth, created_at, bio")
        .eq("id", user.id)
        .single();
      setProfile(userProfile);
      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from("tours")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(bookingsData || []);
      // Fetch wishlist
      const { data: wishlistData } = await supabase
        .from("wishlist")
        .select("*, tours(*)")
        .eq("user_id", user.id);
      setWishlist(wishlistData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  async function handleForgotPassword() {
    if (!user?.email) return;
    await supabase.auth.resetPasswordForEmail(user.email);
    alert("Password reset email sent.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e6f9f0] pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-[#28B872] font-bold">
          <ArrowLeft /> Back
        </button>
        {/* User Info Card - Ultra Modern UI */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative">
          <div className="relative">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-24 h-24 rounded-full object-cover border-4 border-[#28B872] shadow transition hover:scale-105" />
            ) : (
              <div className="rounded-full bg-[#28B872] text-white w-24 h-24 flex items-center justify-center text-4xl font-bold">
                <User className="w-12 h-12" />
              </div>
            )}
            <span className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold text-[#28B872] shadow">PRO</span>
            <button className="absolute top-2 right-2 bg-[#e6f9f0] text-[#28B872] px-2 py-1 rounded-full text-xs font-semibold shadow hover:bg-[#28B872] hover:text-white transition">Edit</button>
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-gray-900 mb-1">{profile?.display_name || profile?.email || "User"}</div>
            <div className="text-gray-500 text-sm mb-1">ID: {profile?.id}</div>
            <div className="text-gray-400 text-xs mb-2">Joined: {profile?.created_at?.slice(0,10) || "-"}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              {profile?.email && <span className="bg-[#e6f9f0] text-[#28B872] px-3 py-1 rounded-full text-xs font-semibold">{profile.email}</span>}
              {profile?.phone && <span className="bg-[#e6f9f0] text-[#28B872] px-3 py-1 rounded-full text-xs font-semibold">{profile.phone}</span>}
              {profile?.gender && <span className="bg-[#e6f9f0] text-[#28B872] px-3 py-1 rounded-full text-xs font-semibold">{profile.gender}</span>}
              {profile?.date_of_birth && <span className="bg-[#e6f9f0] text-[#28B872] px-3 py-1 rounded-full text-xs font-semibold">DOB: {profile.date_of_birth}</span>}
            </div>
            {profile?.bio && <div className="text-gray-700 text-sm italic mb-2">{profile.bio}</div>}
            {/* Stats Row */}
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col items-center bg-[#f8fafc] rounded-xl px-4 py-2 shadow hover:shadow-lg transition cursor-pointer">
                <Calendar className="text-[#28B872] mb-1" />
                <span className="font-bold text-lg text-gray-900">{bookings.length}</span>
                <span className="text-xs text-gray-500">Bookings</span>
              </div>
              <div className="flex flex-col items-center bg-[#f8fafc] rounded-xl px-4 py-2 shadow hover:shadow-lg transition cursor-pointer">
                <Bookmark className="text-[#28B872] mb-1" />
                <span className="font-bold text-lg text-gray-900">{wishlist.length}</span>
                <span className="text-xs text-gray-500">Wishlist</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 absolute top-2 left-2">
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f8fafc] text-[#28B872] font-semibold hover:bg-[#e6f9f0] transition">
              <LogOut className="w-5 h-5" /> Logout
            </button>
            <button onClick={handleForgotPassword} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f8fafc] text-[#28B872] font-semibold hover:bg-[#e6f9f0] transition">
              <KeyRound className="w-5 h-5" /> Forgot Password
            </button>
          </div>
        </div>
        {/* Bookings & Saved Trips - Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2 text-[#28B872] font-semibold">
              <Calendar /> My Bookings
            </div>
            {bookings.length === 0 ? (
              <div className="text-gray-400 text-sm">No bookings yet.</div>
            ) : (
              <ul className="space-y-2">
                {bookings.map((b) => (
                  <li key={b.id} className="border-b pb-2 hover:bg-[#f8fafc] transition rounded">
                    <div className="font-bold text-gray-800">{b.title || b.id}</div>
                    <div className="text-xs text-gray-500">{b.created_at?.slice(0,10)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2 text-[#28B872] font-semibold">
              <Bookmark /> Saved Trips
            </div>
            {wishlist.length === 0 ? (
              <div className="text-gray-400 text-sm">No saved trips.</div>
            ) : (
              <ul className="space-y-2">
                {wishlist.map((w) => (
                  <li key={w.id} className="border-b pb-2 hover:bg-[#f8fafc] transition rounded">
                    <div className="font-bold text-gray-800">{w.tours?.title || w.tour_id}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Activity & Support - Modern Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2 text-[#28B872] font-semibold">
              <CreditCard /> Activity & Transactions
            </div>
            {/* Mock transaction data for now */}
            <ul className="space-y-2">
              <li className="flex justify-between items-center text-sm text-gray-700">
                <span>Trip Payment - Wenchi</span>
                <span className="text-green-600 font-bold">ETB 2,700</span>
                <span className="text-xs text-gray-400">2025-08-15</span>
              </li>
              <li className="flex justify-between items-center text-sm text-gray-700">
                <span>Trip Payment - Bale Mountains</span>
                <span className="text-green-600 font-bold">ETB 3,200</span>
                <span className="text-xs text-gray-400">2025-07-10</span>
              </li>
              <li className="flex justify-between items-center text-sm text-gray-700">
                <span>Refund - Simien</span>
                <span className="text-red-500 font-bold">ETB -1,000</span>
                <span className="text-xs text-gray-400">2025-06-20</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2 text-[#28B872] font-semibold">
              <HelpCircle /> Support & Help
            </div>
            <div className="text-gray-400 text-sm">Need help? Contact us at <a href="mailto:support@wedet.com" className="underline text-[#28B872]">support@wedet.com</a></div>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}


