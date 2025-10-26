"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import {
    Users,
    MapPin,
    CalendarDays,
    Calendar,
    Clock,
    Home,
    User, // Using User for Passenger icon
    Plane, // Using Plane for the 'flight' element
    CreditCard, // Using CreditCard for payment/total paid
    Ticket, // Using Ticket for the main section
    Tag,
    ArrowBigDownDash,
    TrainTrack,
    MapPlus,
    Map,
    Group,
    CircleUser,
    Clock1,
    IdCard,
    ArrowLeft, // New icon for Guide/Host
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import Pintick from "../../../../../public/Pintick.png"; // Assuming Pintick.png is the logo/avatar
import {
    diffDaysInclusive,
    formatDateRange,
    getNumberField,
    getStringArray,
    getStringField,
    makeBookingId,
    todayDDMMYYYY,
    toImageUrlFromStorageKey,
} from "@/lib/utils";

// --- Utility Functions (Kept as is for functionality) ---

const FALLBACK_IMG = "/image2.jpg"; // ensure this exists in /public

type TripSummaryData = {
    imageUrl: string;
    title: string;
    location: string;
    dateRange: string;
    duration: string;
    guide: string;
};

const TicketDivider = () => (
    <div className="relative my-6">
        {/* Dashed line */}
        <div className="border-t border-dashed border-gray-300 w-full" />
        {/* Left Cutout Circle */}
        <div
            className="absolute top-1/2 -left-3 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white z-10"
            style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)" }} // Simulate inner shadow for depth
        />
        {/* Right Cutout Circle */}
        <div
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white z-10"
            style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)" }} // Simulate inner shadow for depth
        />
    </div>
);

const SecondaryDetailItem: React.FC<{
    Icon: React.ElementType;
    label: string;
    value: string | undefined | null;
    loading: boolean;
    // New prop to apply the style for the desired look
    isSmall?: boolean;
}> = ({ Icon, label, value, loading, isSmall = false }) => (
    <div className="flex flex-col items-center justify-center text-center">
        {" "}
        {/* Center content */}
        {/* Icon removed for closer resemblance to image's small detail section */}
        <div>
            <div className="flex ">
                {Icon ? (
                    <Icon
                        className={`mb-1 ${
                            isSmall ? "w-4 h-4" : "w-5 h-5"
                        } text-gray-400`}
                    />
                ) : null}
            </div>

            {loading ? (
                <Skeleton
                    className={`h-4 ${isSmall ? "w-16" : "w-28"} mt-1 mx-auto`}
                />
            ) : (
                <p
                    className={`text-gray-400  leading-snug ${
                        isSmall ? "text-sm" : "text-sm"
                    }`}
                >
                    {value || "N/A"}
                </p>
            )}
        </div>
    </div>
);

export default function TicketPage() {
    const { id } = useParams<{ id: string }>();
    const numericId = useMemo(() => Number(id), [id]);

    const [loading, setLoading] = useState(true);
    const [trip, setTrip] = useState<TripSummaryData | null>(null);
    const [tripImage, setTripImage] = useState<string>(FALLBACK_IMG);
    const router = useRouter();

    const [travelerName, setTravelerName] = useState<string>("Guest Traveler");
    const [groupSize, setGroupSize] = useState<number>(1);
    const [bookedOn, setBookedOn] = useState<string>(todayDDMMYYYY());
    const [totalPaid, setTotalPaid] = useState<number>(2900);

    const [perPerson, setPerPerson] = useState<number>(2700);
    const serviceFee = 100;
    const processingFee = 25;

    const [bookingId, setBookingId] = useState<string>("");

    // --- Original Logic for Data Fetching and State Initialization ---
    useEffect(() => {
        if (!numericId || Number.isNaN(numericId)) return;
        const key = `bookingId:${numericId}`;
        const existing =
            typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (existing) {
            setBookingId(existing);
        } else {
            const bid = makeBookingId(numericId);
            setBookingId(bid);
            try {
                localStorage.setItem(key, bid);
            } catch {}
        }
    }, [numericId]);

    useEffect(() => {
        try {
            const fn = localStorage.getItem("booking_firstName") || "";
            const ln = localStorage.getItem("booking_lastName") || "";
            const np = localStorage.getItem("booking_numberOfPeople");
            const tp = localStorage.getItem("booking_totalPaid");
            const full = `${fn} ${ln}`.trim();
            if (full) setTravelerName(full);
            if (np && !Number.isNaN(Number(np))) setGroupSize(Number(np));
            if (tp && !Number.isNaN(Number(tp))) setTotalPaid(Number(tp));
        } catch {}
        setBookedOn(todayDDMMYYYY());
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!numericId || Number.isNaN(numericId)) {
                setLoading(false);
                return;
            }
            setLoading(true);
            const { data: rowData, error } = await supabase
                .from("tours")
                .select("*")
                .eq("id", numericId)
                .maybeSingle();

            if (!mounted) return;

            if (!error && rowData) {
                const row = rowData as Record<string, unknown>;

                const tourName = getStringField(row, "tourName") ?? "";
                const destination = getStringField(row, "destination") ?? "";
                const photos = getStringArray(row.photos) ?? [];
                const start_date = getStringField(row, "start_date") ?? null;
                const end_date = getStringField(row, "end_date") ?? null;

                let img = FALLBACK_IMG;
                if (photos.length) {
                    try {
                        const url = await toImageUrlFromStorageKey(photos[0]);
                        if (url && url.trim() !== "") img = url;
                    } catch {}
                }
                setTripImage(img);

                const title =
                    tourName && destination
                        ? `${tourName}` // Using tourName as the main title
                        : tourName || destination || "Trip";
                const location = destination; // Using destination as the location
                const dateRange = formatDateRange(start_date, end_date);
                const days = diffDaysInclusive(start_date, end_date);
                const duration = days > 0 ? `${days} days` : "";
                const guide =
                    getStringField(row, "guideName") ??
                    getStringField(row, "guide") ??
                    "Local guide";

                setTrip({
                    imageUrl: img,
                    title,
                    location,
                    dateRange,
                    duration,
                    guide,
                });

                const totalFromDb = getNumberField(row, "total");
                const priceFromDb = getNumberField(row, "price");
                const effectivePerPerson = totalFromDb ?? priceFromDb ?? 2700;
                setPerPerson(effectivePerPerson);

                if (!totalPaid || totalPaid <= 0) {
                    const computed =
                        effectivePerPerson * groupSize +
                        serviceFee +
                        processingFee;
                    setTotalPaid(computed);
                }
            }

            setLoading(false);
        })();
        return () => {
            mounted = false;
        };
    }, [numericId, totalPaid, groupSize]);

    const qrPayload = useMemo(() => {
        const payload = {
            v: 1,
            bookingId,
            tourId: numericId,
            name: travelerName,
            bookedOnISO: new Date().toISOString(),
            verifyUrl: `/verify/${bookingId}`,
        };
        return JSON.stringify(payload);
    }, [bookingId, numericId, travelerName]);
    // --- End of Original Logic ---

    // Derived values for the UI slots
    const departureCityCode =
        trip?.location.split(/\s|,/)[0]?.toUpperCase().slice(0, 3) || "TRP";
    const arrivalCityCode = "DST"; // Destination is the end
    const shortTitle = trip?.title.split(/\s/)[0] || "TOUR";
    const dateForPass = bookedOn.replace(/\//g, "-");
    const tripImageForAvatar = tripImage;

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-white p-4 sm:p-8 font-sans">
            <div className="w-full max-w-xl flex justify-start mb-6">
                <button
                    className="p-2 bg-white/80 rounded-full hover:bg-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.back();
                    }}
                >
                    <ArrowLeft size={20} className="text-green-500" />
                </button>
            </div>

            {/* Main Ticket Container */}
            <div className="w-full lg:w-[500px]   bg-white shadow-2xl rounded-3xl overflow-hidden">
                {/* Boarding Pass Header (Dark green Section) */}
                <div className="bg-[#28B872] text-white p-6 sm:p-8 rounded-t-3xl">
                    <h1 className="text-xl font-extrabold mb-4 flex justify-center tracking-wide">
                        Your Ticket
                    </h1>

                    {/* Passenger & Date Row */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            {/* Passenger Avatar (using trip image) */}
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-full bg-white/50" />
                                ) : (
                                    <Image
                                        src={tripImageForAvatar}
                                        alt="Traveler"
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="text-sm text-green-200 font-medium uppercase leading-snug">
                                    {trip?.location}
                                </p>
                                <div className="text-base font-bold leading-snug">
                                    {loading ? (
                                        <Skeleton className="h-4 w-28 bg-green-300" />
                                    ) : (
                                        travelerName
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-sm text-green-200 font-medium uppercase leading-snug">
                                Booked On
                            </p>
                            <div className="text-base font-bold leading-snug">
                                {loading ? (
                                    <Skeleton className="h-4 w-20 bg-green-300" />
                                ) : (
                                    dateForPass
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Trip Route Row */}
                    <div className="flex justify-between items-center text-center mt-4">
                        {/* Departure (Location) */}
                        <div className="flex flex-col items-start">
                            <p className="text-4xl font-extrabold">
                                {departureCityCode}
                            </p>
                            <p className="text-xs text-green-200 uppercase font-semibold mt-1">
                                {trip?.location || "Loading..."}
                            </p>
                        </div>

                        {/* Middle Icon and Name (Trip ID) */}
                        <div className="flex flex-col items-center">
                            <Ticket className="w-8 h-8 text-green-200 mb-1 " />
                            <p className="text-sm font-bold tracking-wider">
                                {shortTitle}
                            </p>
                            <p className="text-xs text-green-200">
                                {bookingId
                                    ? `ID: ${bookingId.slice(-6)}`
                                    : "AG 865"}
                            </p>
                        </div>
                        {/* Arrival (Title) - Using Title as destination */}
                        <div className="flex flex-col items-end">
                            <p className="text-4xl font-extrabold">
                                {arrivalCityCode}
                            </p>
                            <p className="text-xs text-green-200 uppercase font-semibold mt-1 ">
                                {trip?.title || "Loading..."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ticket Body (White Section) */}
                <div className="p-6 sm:p-8">
                    {/* Main QR Code Section */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        {/* Title Above QR Code */}

                        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                            {bookingId ? (
                                <QRCode
                                    value={qrPayload}
                                    size={200} // Slightly larger for prominence
                                    level="H"
                                    className="p-1"
                                    viewBox={`0 0 200 200`} // Ensure proper scaling
                                />
                            ) : (
                                <Skeleton className="w-[200px] h-[200px] rounded-lg" />
                            )}
                        </div>
                    </div>

                    <TicketDivider />

                    <div className="grid grid-cols-4 gap-y-2 gap-x-2 text-sm text-center">
                        <SecondaryDetailItem
                            Icon={IdCard} // Icon not visible, but kept for context
                            label=""
                            value={`${bookingId.slice(-6)}`} // Hardcoded example
                            loading={loading}
                            isSmall={true}
                        />
                        <SecondaryDetailItem
                            Icon={Users} // Icon not visible, but kept for context
                            label=""
                            value={`${groupSize} ${
                                groupSize === 1 ? " person" : " people"
                            }`} // Hardcoded example
                            loading={loading}
                            isSmall={true}
                        />
                        <SecondaryDetailItem
                            Icon={CircleUser} // Icon not visible, but kept for context
                            label=""
                            value={trip?.guide} // Hardcoded example
                            loading={loading}
                            isSmall={true}
                        />
                        <SecondaryDetailItem
                            Icon={Clock1} // Icon not visible, but kept for context
                            label=""
                            value={trip?.duration} // Hardcoded example
                            loading={loading}
                            isSmall={true}
                        />
                    </div>

                    <TicketDivider />

                    {/* Total Paid / Cost Summary */}
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4 sm:p-5 flex flex-row items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-green-500" />
                            <p className="text-gray-500 font-semibold text-sm sm:text-base">
                                Total Paid
                            </p>
                        </div>

                        {loading ? (
                            <Skeleton className="h-8 w-32 rounded-lg" />
                        ) : (
                            <h3 className="text-green-500 text-xl sm:text-xl font-extrabold tracking-tight">
                                {totalPaid.toLocaleString()} Br
                            </h3>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center rounded-b-3xl">
                    <button className="w-full max-w-sm py-3 px-6 bg-[#28B872] text-white font-bold rounded-full text-lg shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center">
                        <span className="mr-2">Download Ticket</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-download"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-10"></div>
        </div>
    );
}
