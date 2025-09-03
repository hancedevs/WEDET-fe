"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Users, MapPin, CalendarDays, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/app/components/ui/navBar";
import { supabase } from "@/lib/supabaseClient";
import Pintick from "../../../../../public/Pintick.png"

const DEFAULT_TOUR_BUCKET = "tours";
const FALLBACK_IMG = "/image2.jpg"; // ensure this exists in /public

const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);

async function toSignedUrl(bucket: string, path: string, secs = 60 * 60 * 6) {
  const key = path.replace(new RegExp(`^${bucket}/`), "");
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, secs);
  if (!error && data?.signedUrl) return data.signedUrl;
  return supabase.storage.from(bucket).getPublicUrl(key).data.publicUrl;
}
async function toImageUrlFromStorageKey(path: string, bucket = DEFAULT_TOUR_BUCKET) {
  if (isFullUrl(path) || isDataUrl(path)) return path;
  return toSignedUrl(bucket, path);
}
function getStringField(row: Record<string, unknown>, key: string) {
  const v = row[key];
  return typeof v === "string" ? v : undefined;
}
function getStringArray(val: unknown): string[] | undefined {
  return Array.isArray(val) && val.every((x) => typeof x === "string") ? (val as string[]) : undefined;
}
function getNumberField(row: Record<string, unknown>, key: string) {
  const v = row[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
function diffDaysInclusive(a?: string | null, b?: string | null) {
  if (!a || !b) return 0;
  const da = new Date(a), db = new Date(b);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0;
  const ms = db.getTime() - da.getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}
function formatDateRange(start?: string | null, end?: string | null) {
  if (!start || !end) return "";
  const s = new Date(start), e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
  const sameYear = s.getFullYear() === e.getFullYear();
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", opts);
  return sameYear
    ? `${fmt(s, { month: "short", day: "numeric" })}-${fmt(e, { month: "short", day: "numeric", year: "numeric" })}`
    : `${fmt(s, { month: "short", day: "numeric", year: "numeric" })}-${fmt(e, { month: "short", day: "numeric", year: "numeric" })}`;
}
function todayDDMMYYYY(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function makeBookingId(tourId: number) {
  // Example: WDT-2025-AB12CD  (timestamp + tour id)
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WDT-${year}-${rand}${tourId.toString().padStart(2, "0")}`;
}

/* ===================== types ===================== */
type TripSummaryData = {
  imageUrl: string;
  title: string;
  location: string;
  dateRange: string;
  duration: string;
  guide: string;
};

/* ===================== component ===================== */
export default function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = useMemo(() => Number(id), [id]);

  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<TripSummaryData | null>(null);
  const [tripImage, setTripImage] = useState<string>(FALLBACK_IMG);

  // a simple “booking” slice; if you persist data from earlier steps, read from localStorage
  const [travelerName, setTravelerName] = useState<string>("Guest Traveler");
  const [groupSize, setGroupSize] = useState<number>(1);
  const [bookedOn, setBookedOn] = useState<string>(todayDDMMYYYY());
  const [totalPaid, setTotalPaid] = useState<number>(2900); // fallback total

  // price ingredients (if you stored them earlier, read from localStorage; otherwise compute)
  const [perPerson, setPerPerson] = useState<number>(2700);
  const serviceFee = 100;
  const processingFee = 25;

  // booking id per tour, persisted so refresh doesn’t change it
  const [bookingId, setBookingId] = useState<string>("");

  // 1) booking id bootstrap (independent of trip fetch)
  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) return;
    const key = `bookingId:${numericId}`;
    const existing = typeof window !== "undefined" ? localStorage.getItem(key) : null;
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

  // 2) read optional client-side info saved by earlier steps (if you wired it)
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

  // 3) fetch trip from Supabase
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

        // image
        let img = FALLBACK_IMG;
        if (photos.length) {
          try {
            const url = await toImageUrlFromStorageKey(photos[0]);
            if (url && url.trim() !== "") img = url;
          } catch {}
        }
        setTripImage(img);

        // text
        const title =
          tourName && destination ? `${tourName}` : tourName || destination || "Trip";
        const location = destination;
        const dateRange = formatDateRange(start_date, end_date);
        const days = diffDaysInclusive(start_date, end_date);
        const duration = days > 0 ? `${days} days` : "";
        const guide = getStringField(row, "guideName") ?? getStringField(row, "guide") ?? "Local guide";

        setTrip({ imageUrl: img, title, location, dateRange, duration, guide });

        // price (prefer total, else price), compute totalPaid if not provided
        const totalFromDb = getNumberField(row, "total");
        const priceFromDb = getNumberField(row, "price");
        const effectivePerPerson = totalFromDb ?? priceFromDb ?? 2700;
        setPerPerson(effectivePerPerson);

        if (!totalPaid || totalPaid <= 0) {
          const computed = effectivePerPerson * groupSize + serviceFee + processingFee;
          setTotalPaid(computed);
        }
      }

      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId]);

  // QR payload (unique, no static images; SVG via react-qr-code)
  const qrPayload = useMemo(() => {
    const payload = {
      v: 1,
      bookingId,
      tourId: numericId,
      name: travelerName,
      bookedOnISO: new Date().toISOString(),
      verifyUrl: `/verify/${bookingId}`, // adjust if you expose a verify route
    };
    return JSON.stringify(payload);
  }, [bookingId, numericId, travelerName]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* Header */}
      <div
        className="w-full max-w-md flex flex-col items-center px-6 py-8 shadow-lg"
        style={{ backgroundColor: "#28B872" }}
      >
        <Image src={Pintick} alt="Pintick" width={120} height={120} className="mb-4" />
        <h1 className="text-2xl font-bold text-white">Adventure Booked</h1>
      </div>

      {/* Digital Ticket card */}
      <div
        className="relative w-[93%] max-w-md px-4 py-7 my-5 mx-auto overflow-hidden"
        style={{
          backgroundColor: "#28B872",
          borderRadius: "2.3rem",
        }}
      >
        {/* Half Circle Bottom Left */}
        <div className="absolute bottom-[-50px] left-6 w-20 h-20 bg-gradient-to-t from-green-500 to-green-300 rounded-full" />
        {/* Half Circle Top Right */}
        <div className="absolute -top-5 right-8 w-20 h-14 bg-gradient-to-b from-green-500 to-green-300 rounded-b-full" />
        {/* Content */}
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h3 className="text-white text-xl font-bold">Digital Ticket</h3>
            <p className="text-white text-sm font-semibold">Keep this safe for your trip</p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm font-semibold">Booking ID</p>
            {bookingId ? (
              <p className="text-white text-base font-semibold">{bookingId}</p>
            ) : (
              <Skeleton className="h-5 w-36" />
            )}
          </div>
        </div>
      </div>

      {/* Ticket Summary */}
      <div className="flex items-center space-x-4 mt-6 w-[90%] max-w-md">
        {/* Image */}
        <div className="w-22 h-22 rounded-2xl overflow-hidden flex-shrink-0">
          {loading ? (
            <Skeleton className="w-20 h-20 rounded-2xl" />
          ) : (
            <Image
              src={tripImage}
              alt={trip?.title || "Trip"}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {/* Trip Info */}
        <div className="flex-1">
          {loading ? (
            <>
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-3 w-32 mb-2" />
              <div className="flex items-center space-x-4 mt-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-black font-bold text-base">{trip?.title}</h1>
              <p className="text-gray-500 text-sm">{trip?.location}</p>
              <div className="flex items-center space-x-4 mt-1 text-black-500 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>{trip?.dateRange}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>{trip?.duration}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <hr className="border-t border-gray-300 my-6 w-[90%] max-w-md" />

      {/* Detail Info */}
      <div className="w-[95%] max-w-md grid grid-cols-2 gap-y-6 gap-x-6 px-2">
        {/* Traveler */}
        <div className="flex items-start space-x-2">
          <Users className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Traveler</p>
            {loading ? <Skeleton className="h-4 w-40" /> : <p className="text-black font-semibold">{travelerName}</p>}
          </div>
        </div>
        {/* Group Size */}
        <div className="flex items-start space-x-2">
          <Users className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Group Size</p>
            {loading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <p className="text-black font-semibold">{groupSize} {groupSize === 1 ? "person" : "people"}</p>
            )}
          </div>
        </div>
        {/* Guide */}
        <div className="flex items-start space-x-2">
          <MapPin className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Guide</p>
            {loading ? <Skeleton className="h-4 w-32" /> : <p className="text-black font-semibold">{trip?.guide}</p>}
          </div>
        </div>
        {/* Booked On */}
        <div className="flex items-start space-x-2">
          <CalendarDays className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Booked On</p>
            {loading ? <Skeleton className="h-4 w-24" /> : <p className="text-black font-semibold">{bookedOn}</p>}
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-6 w-[90%] max-w-md" />

      {/* QR + Payment */}
      <div className="flex flex-col items-center">
        {/* QR: dynamic SVG (not a static image) */}
        <div className="bg-green-100 p-5 rounded-3xl shadow-md flex items-center justify-center">
          {bookingId ? (
            <QRCode value={qrPayload} size={200} />
          ) : (
            <Skeleton className="w-[200px] h-[200px] rounded-xl" />
          )}
        </div>

        <hr className="border-t border-gray-300 my-6 w-[95%] max-w-md" />

        {/* Payment Info */}
        <div className="bg-gray-100 px-6 py-3 rounded-lg text-center shadow-sm">
          <p className="text-gray-500 text-sm">Total Paid</p>
          {loading ? (
            <Skeleton className="h-7 w-28 mx-auto my-1" />
          ) : (
            <h3 className="text-green-600 font-bold text-xl">
              {totalPaid.toLocaleString()}Br
            </h3>
          )}
          <p className="text-gray-500 text-sm">Payment confirmed</p>
        </div>

        <NavBar />
      </div>
    </div>
  );
}
