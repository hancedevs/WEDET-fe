import { BookingItem } from "@/types/type";

function BookingsTab({
    bookings,
    profile,
}: {
    bookings: BookingItem[];
    profile: any;
}) {
    return (
        <div className="p-4">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search bookings..."
                    className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28B872] transition shadow-sm"
                    style={{ fontFamily: "'Century Gothic', sans-serif" }}
                />
            </div>

            <div className="bg-gradient-to-r from-[#28B872] to-[#145c38] p-6 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#3dcc84] rounded-full opacity-30"></div>
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#3dcc84] rounded-full opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#3dcc84] rounded-full opacity-10"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-white text-xl">
                            Wedet
                        </span>
                        <div className="w-16 h-8 bg-white rounded-full opacity-30"></div>{" "}
                    </div>

                    <div className="flex flex-col justify-center items-center">
                        <div className="text-white text-2xl font-mono tracking-wider mb-2">
                            <span className="text-3xl mr-2">
                                **** **** **** 1234
                            </span>
                        </div>

                        <div className="text-white text-sm opacity-80 mb-6">
                            Member since 2025
                        </div>
                    </div>

                    <div className="flex justify-between items-end text-white">
                        <div>
                            <div className="text-lg font-bold">
                                {profile.firstName + " " + profile.lastName}
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                                Powered by WEDET
                            </div>
                        </div>
                        <div className="text-sm font-light flex flex-col text-right">
                            EXP{" "}
                            <span className="font-bold text-lg ml-1">
                                12/30
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex justify-between items-center pb-2 border-b border-gray-100"
                    >
                        <div className="font-bold text-lg text-[#28B872]">
                            {booking.name}
                        </div>
                        <div className="text-right">
                            <div
                                className={`font-extrabold text-xl ${
                                    booking.amount < 0
                                        ? "text-[#28B872]"
                                        : "text-[#28B872]"
                                }`}
                            >
                                {booking.amount.toLocaleString()}Br
                            </div>
                            <div className="text-xs text-gray-400">
                                {booking.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookingsTab;
