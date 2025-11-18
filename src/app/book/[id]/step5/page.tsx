"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import {
    Users,
    MapPin,
    CalendarDays,
    Calendar,
    Clock,
    Home,
    User,
    Plane,
    CreditCard,
    Ticket,
    Tag,
    ArrowBigDownDash,
    TrainTrack,
    MapPlus,
    Map,
    Group,
    CircleUser,
    Clock1,
    IdCard,
    ArrowLeft,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import Pintick from "../../../../../public/Pintick.png";
import {
    diffDaysInclusive,
    formatDateRange,
    getNumberField,
    getStringArray,
    getStringField,
    handleDownloadTicket,
    makeBookingId,
    todayDDMMYYYY,
    toImageUrlFromStorageKey,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FALLBACK_IMG = "/image2.jpg";

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
        <div className="border-t border-dashed border-gray-300 w-full" />
        <div
            className="absolute top-1/2 -left-3 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white z-10"
            style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)" }}
        />
        <div
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white z-10"
            style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)" }}
        />
    </div>
);

const SecondaryDetailItem: React.FC<{
    Icon: React.ElementType;
    label: string;
    value: string | undefined | null;
    loading: boolean;
    isSmall?: boolean;
}> = ({ Icon, label, value, loading, isSmall = false }) => (
    <div className="flex flex-col items-center justify-center text-center">
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
                    className={`text-gray-400   leading-snug w-28 text-start ${
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
    const searchParams = useSearchParams();
    const ticketId = searchParams.get("id");
    const numericId = useMemo(() => Number(id), [id]);
    const qrCodeRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [trip, setTrip] = useState<TripSummaryData | null>(null);
    const [tripImage, setTripImage] = useState<string>(FALLBACK_IMG);
    const router = useRouter();

    const [travelerName, setTravelerName] = useState<string>("Guest Traveler");
    const [groupSize, setGroupSize] = useState<number>(1);
    const [bookedOn, setBookedOn] = useState<string>(todayDDMMYYYY());
    const [totalPaid, setTotalPaid] = useState<number>(2900);

    const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
    const [qrCodePNGDataURL, setQrCodePNGDataURL] = useState<string>("");
    const [logoDataURL, setLogoDataURL] = useState<string>("");

    const [bookingId, setBookingId] = useState<string>("");

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
            if (!numericId || Number.isNaN(numericId) || !ticketId) {
                setLoading(false);
                return;
            }
            setLoading(true);

            let publicTicketId = bookingId;
            let tripImg = FALLBACK_IMG;

            const { data: ticketData, error: ticketError } = await supabase
                .from("tickets")
                .select("people, total_price, public_ticket_id")
                .eq("id", ticketId)
                .maybeSingle();

            if (!mounted) return;

            if (!ticketError && ticketData) {
                const row = ticketData as Record<string, unknown>;

                setGroupSize(Number(getNumberField(row, "people")));
                setTotalPaid(Number(getNumberField(row, "total_price")));
                publicTicketId =
                    getStringField(row, "public_ticket_id") || publicTicketId;
                setBookingId(publicTicketId);
            }

            const { data: tourData, error: tourError } = await supabase
                .from("tours")
                .select("tourName, destination, photos, start_date, end_date")
                .eq("id", numericId)
                .maybeSingle();

            if (!mounted) return;

            if (!tourError && tourData) {
                const row = tourData as Record<string, unknown>;

                const tourName = getStringField(row, "tourName") ?? "";
                const destination = getStringField(row, "destination") ?? "";
                const photos = getStringArray(row.photos) ?? [];
                const start_date = getStringField(row, "start_date") ?? null;
                const end_date = getStringField(row, "end_date") ?? null;

                if (photos.length) {
                    try {
                        const url = await toImageUrlFromStorageKey(photos[0]);
                        if (url && url.trim() !== "") tripImg = url;
                    } catch {}
                }
                setTripImage(tripImg);

                const title =
                    tourName && destination
                        ? `${tourName}`
                        : tourName || destination || "Trip";
                const location = destination;
                const dateRange = formatDateRange(start_date, end_date);
                const days = diffDaysInclusive(start_date, end_date);
                const duration = days > 0 ? `${days} days` : "";
                const guide =
                    getStringField(row, "guideName") ??
                    getStringField(row, "guide") ??
                    "Local guide";

                setTrip({
                    imageUrl: tripImg,
                    title,
                    location,
                    dateRange,
                    duration,
                    guide,
                });
            }

            setLoading(false);
        })();

        return () => {
            mounted = false;
        };
    }, [numericId, ticketId]);

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

    useEffect(() => {
        if (bookingId && qrCodeRef.current) {
            const timeoutId = setTimeout(() => {
                const svg = document.getElementById("ticket-qr-svg");

                if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    setQrCodeDataURL(
                        `data:image/svg+xml;base64,${btoa(svgData)}`
                    );
                } else {
                    console.log("QR code SVG not found");
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [bookingId, qrPayload]);

    useEffect(() => {
        if (qrCodeDataURL) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 200;
                canvas.height = 200;

                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0, 200, 200);

                const pngDataUrl = canvas.toDataURL("image/png");
                setQrCodePNGDataURL(pngDataUrl);
            };
            img.onerror = (e) => {
                console.error("Error loading SVG for conversion:", e);
            };
            img.src = qrCodeDataURL;
        }
    }, [qrCodeDataURL]);

    useEffect(() => {
        fetch("/logo.svg")
            .then((response) => response.text())
            .then((svgText) => {
                const svgDataUrl = `data:image/svg+xml;base64,${btoa(
                    unescape(encodeURIComponent(svgText))
                )}`;

                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const logoSize = 50;
                    canvas.width = logoSize;
                    canvas.height = logoSize;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, logoSize, logoSize);

                    const pngDataUrl = canvas.toDataURL("image/png");
                    setLogoDataURL(pngDataUrl);
                };
                img.onerror = (e) => {
                    console.error("Error loading logo SVG for conversion:", e);
                };
                img.src = svgDataUrl;
            })
            .catch((error) => {
                console.error("Failed to fetch logo SVG:", error);
            });
    }, []);

    const departureCityCode =
        trip?.location.split(/\s|,/)[0]?.toUpperCase().slice(0, 3) || "TRP";
    const arrivalCityCode = "DST";
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

            <div className="w-full lg:w-[500px]   bg-white shadow-2xl rounded-3xl overflow-hidden">
                <div className="bg-[#28B872] text-white p-6 sm:p-8 rounded-t-3xl">
                    <h1 className="text-xl font-extrabold mb-4 flex justify-center tracking-wide">
                        Your Ticket
                    </h1>

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            {/* <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-full bg-white/50" />
                                ) : (
                                    <NextImage
                                        src={tripImageForAvatar}
                                        alt="Traveler"
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                )}
                            </div> */}
                            <div className="flex flex-col items-start">
                                <p
                                    className="text-sm text-green-200 font-medium uppercase leading-snug"
                                    onClick={() => {
                                        router.push(`../../trip/${numericId}`);
                                    }}
                                >
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

                    <div className="flex justify-between items-center text-center mt-4">
                        <div className="flex flex-col items-start">
                            <p className="text-4xl font-extrabold">
                                {departureCityCode}
                            </p>
                            <p className="text-xs text-green-200 uppercase font-semibold mt-1">
                                {trip?.location || "Loading..."}
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <Ticket className="w-8 h-8 text-green-200 mb-1 " />
                            <p className="text-sm font-bold tracking-wider">
                                {shortTitle}
                            </p>
                            <p className="text-xs text-green-200">
                                {bookingId ? `ID: ${bookingId}` : "AG 865"}
                            </p>
                        </div>
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

                <div className="p-6 sm:p-8">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                            {bookingId ? (
                                <QRCode
                                    ref={qrCodeRef}
                                    value={qrPayload}
                                    size={200}
                                    level="H"
                                    className="p-1"
                                    viewBox={`0 0 200 200`}
                                    id="ticket-qr-svg"
                                />
                            ) : (
                                <Skeleton className="w-[200px] h-[200px] rounded-lg" />
                            )}
                        </div>
                    </div>

                    <TicketDivider />

                    <div className="grid grid-cols-3  lg:grid-cols-4 gap-y-2 gap-x-2 text-sm text-center">
                        <SecondaryDetailItem
                            Icon={IdCard}
                            label=""
                            value={`${bookingId}`}
                            loading={loading}
                            isSmall={true}
                        />
                        <SecondaryDetailItem
                            Icon={Users}
                            label=""
                            value={`${groupSize} ${
                                groupSize === 1 ? " person" : " people"
                            }`}
                            loading={loading}
                            isSmall={true}
                        />
                        <SecondaryDetailItem
                            Icon={CircleUser}
                            label=""
                            value={trip?.guide}
                            loading={loading}
                            isSmall={true}
                        />
                        <SecondaryDetailItem
                            Icon={Clock1}
                            label=""
                            value={trip?.duration}
                            loading={loading}
                            isSmall={true}
                        />
                    </div>

                    <TicketDivider />

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
                    <Button
                        className="w-full max-w-sm py-6 px-6 bg-[#28B872] text-white font-bold rounded-full text-lg shadow-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
                        disabled={loading || !bookingId || !trip}
                        onClick={() =>
                            handleDownloadTicket({
                                trip,
                                travelerName,
                                bookingId,
                                groupSize,
                                totalPaid,
                                bookingDate: bookedOn,
                                qrCodeDataURL: qrCodePNGDataURL,
                                logoDataURL: logoDataURL,
                            })
                        }
                    >
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
                    </Button>
                </div>
            </div>
            <div className="h-10"></div>
        </div>
    );
}
