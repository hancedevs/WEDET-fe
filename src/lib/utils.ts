import { Role } from "@/types/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User as SupaUser, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LOGO_TOP_Y = 15;
const LOGO_SIZE = 35; // Assuming 30x30pt si

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const ONBOARDING_STEPS = [
    {
        id: 1,
        title: "Welcome to Wedet",
        description:
            "Your personal productivity companion to help you stay organized and efficient",
        image: "/Picture1.png",
    },
    {
        id: 2,
        title: "Task Management",
        description:
            "Easily create, organize and track all your tasks in one place",
        image: "/Picture2.png",
    },
    {
        id: 3,
        title: "Collaboration",
        description:
            "Work seamlessly with your team on shared projects and tasks",
        image: "/Picture3.png",
    },
    {
        id: 4,
        title: "Analytics",
        description:
            "Get insights into your productivity with detailed analytics",
        image: "/Picture4.png",
    },
];
export function isRole(v: unknown): v is Role {
    return v === "normal_user" || v === "business_user";
}

export function isEmailVerified(u: SupaUser): boolean {
    // Supabase exposes both; either being set means verified
    return Boolean(u.email_confirmed_at || u.confirmed_at);
}

export async function getUserRole(u: SupaUser): Promise<Role> {
    // 1) prefer auth metadata
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
    const metaRole = meta["role"];
    if (isRole(metaRole)) return metaRole;

    // 2) fallback to your public.user table
    type UserRow = { role: Role } | null;
    const { data } = await supabase
        .from("user")
        .select("role")
        .eq("id", u.id)
        .maybeSingle();
    const row = data as UserRow;
    return isRole(row?.role) ? row.role : "normal_user";
}

export function getUserInfo(user: User) {
    const meta = user.user_metadata ?? {};
    const id0 = user.identities?.[0]?.identity_data ?? {};

    const pickStr = (
        obj: Record<string, unknown>,
        key: string
    ): string | null =>
        typeof obj[key] === "string" && obj[key] ? (obj[key] as string) : null;

    // If businessProfile exists, pick businessName and email from it
    const businessProfile = (meta.businessProfile ?? id0.businessProfile) as
        | Record<string, unknown>
        | undefined;

    const businessName = businessProfile
        ? pickStr(businessProfile, "BusinessName")
        : null;

    const businessEmail = businessProfile
        ? pickStr(businessProfile, "email")
        : null;

    const firstName =
        pickStr(meta, "firstName") ??
        pickStr(meta, "first_name") ??
        pickStr(meta, "given_name") ??
        pickStr(id0, "firstName") ??
        pickStr(id0, "first_name") ??
        pickStr(id0, "given_name") ??
        (typeof meta["name"] === "string"
            ? (meta["name"] as string).split(" ")[0]
            : null) ??
        (typeof id0["name"] === "string"
            ? (id0["name"] as string).split(" ")[0]
            : null) ??
        (typeof user.email === "string" ? user.email.split("@")[0] : null);

    const lastName =
        pickStr(meta, "lastName") ??
        pickStr(meta, "last_name") ??
        pickStr(meta, "family_name") ??
        pickStr(id0, "lastName") ??
        pickStr(id0, "last_name") ??
        pickStr(id0, "family_name");

    const avatarUrl =
        pickStr(meta, "avatar_url") ??
        pickStr(meta, "picture") ??
        pickStr(id0, "avatar_url") ??
        pickStr(id0, "picture");

    const email = businessEmail ?? user.email ?? null; // prioritize business email
    const phone = user.phone ?? null;
    const userId = user.id ?? null;

    return {
        userId,
        firstName,
        lastName,
        email,
        phone,
        avatarUrl,
        businessName,
    };
}
const DEFAULT_TOUR_BUCKET = "tours";
export const isFullUrl = (s?: string) => !!s && /^https?:\/\//i.test(s);
export const isDataUrl = (s?: string) => !!s && /^data:/i.test(s);
export const getStringField = (obj: Record<string, unknown>, k: string) =>
    typeof obj[k] === "string" ? (obj[k] as string) : undefined;
export const getNumberField = (obj: Record<string, unknown>, k: string) =>
    typeof obj[k] === "number" && Number.isFinite(obj[k] as number)
        ? (obj[k] as number)
        : undefined;
export const getStringArray = (v: unknown): string[] | undefined =>
    Array.isArray(v) && v.every((x) => typeof x === "string")
        ? (v as string[])
        : undefined;

export async function toSignedUrl(
    bucket: string,
    path: string,
    secs = 60 * 60 * 6
) {
    const key = path.replace(new RegExp(`^${bucket}/`), "");
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(key, secs);
    if (!error && data?.signedUrl) return data.signedUrl;
    return supabase.storage.from(bucket).getPublicUrl(key).data.publicUrl;
}
export async function toImageUrlFromStorageKey(
    path: string,
    bucket = DEFAULT_TOUR_BUCKET
) {
    if (isFullUrl(path) || isDataUrl(path)) return path;
    return toSignedUrl(bucket, path);
}
export function fmtMoneyStr(n?: number | null): string {
    if (!Number.isFinite(n as number)) return "";
    return new Intl.NumberFormat("en-ET", { maximumFractionDigits: 0 }).format(
        n as number
    );
}
export function diffDaysInclusive(
    a?: string | null,
    b?: string | null
): number {
    if (!a || !b) return 0;
    const da = new Date(a);
    const db = new Date(b);
    if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0;
    const ms = db.getTime() - da.getTime();
    return Math.max(1, Math.round(ms / (24 * 3600 * 1000)) + 1);
}

/** Build activities JSON string compatible with Detailfilter:
 * {
 *   "day1": { "activities": [{ "time": "08:00", "activity": "..." }], "meals": {...} },
 *   "day2": { ... }
 * }
 */
export function buildActivitiesJson(val: unknown): string | undefined {
    // if DB already stores correct JSON string, keep it
    if (typeof val === "string") {
        try {
            JSON.parse(val);
            return val;
        } catch {
            /* fall through and try to convert */
        }
    }

    // if we got an array of {time?, activity?}
    if (Array.isArray(val)) {
        const normalized = val
            .filter((x) => x && typeof x === "object")
            .map((x) => {
                const o = x as Record<string, unknown>;
                return {
                    time: typeof o.time === "string" ? o.time : undefined,
                    activity:
                        typeof o.activity === "string" ? o.activity : undefined,
                };
            });

        if (normalized.length) {
            const obj: Record<string, unknown> = {};
            // put all into day1 (we don't know day boundaries from array)
            obj["day1"] = { activities: normalized };
            return JSON.stringify(obj);
        }
    }

    // give up
    return undefined;
}

export function formatDateRange(start?: string | null, end?: string | null) {
    if (!start || !end) return "";
    const s = new Date(start),
        e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    const sameYear = s.getFullYear() === e.getFullYear();
    const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
        d.toLocaleDateString("en-US", opts);
    return sameYear
        ? `${fmt(s, { month: "short", day: "numeric" })}-${fmt(e, {
              month: "short",
              day: "numeric",
              year: "numeric",
          })}`
        : `${fmt(s, { month: "short", day: "numeric", year: "numeric" })}-${fmt(
              e,
              { month: "short", day: "numeric", year: "numeric" }
          )}`;
}
export function todayDDMMYYYY(d = new Date()) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
export function makeBookingId(tourId: number) {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `WDT-${year}-${rand}${tourId.toString().padStart(2, "0")}`;
}
export const handleDownloadTicket = ({
    trip,
    travelerName,
    bookingId,
    groupSize,
    totalPaid,
    bookedDate, // No longer defaults here, assuming it's passed or handled upstream
    qrCodeDataURL, // New parameter for QR code image data
    logoDataURL, // New parameter for logo image data
}: any) => {
    // Initialize PDF document (A4, points)
    const doc = new jsPDF("portrait", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const paddingX = 40;
    let y = 0;

    // --- Colors & Styling ---
    const PrimaryGreen = "#28B872";
    const LightGreen = "#EAF7F1";
    const DarkText = "#1A1A1A";
    const GrayText = "#666666";
    const MutedWhite = "#E0E0E0";

    // Ensure bookedDate has a default if not provided
    const formattedBookedDate =
        bookedDate ||
        new Date()
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, "-");

    // --- 1. Green Header Card (240pt height) ---
    const HEADER_HEIGHT = 240;
    doc.setFillColor(PrimaryGreen);
    doc.rect(0, 0, pageWidth, HEADER_HEIGHT, "F");

    // "Your Ticket" Title
    doc.setFontSize(16);
    doc.setTextColor("#ffffff");
    doc.setFont(undefined, "bold");
    doc.text("Your Ticket", pageWidth / 2, (y += 30), { align: "center" });
    y += 20;

    if (logoDataURL) {
        // 1. Move the Logo
        doc.addImage(
            logoDataURL,
            "PNG",
            paddingX,
            LOGO_TOP_Y, // <-- Use the fixed top position here
            LOGO_SIZE,
            LOGO_SIZE
        );

        // ^ 5pt gap, +3pt to align to text baseline center.
    } else {
        // If no logo image, adjust text-only placeholder position as well
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text("WEDET", paddingX, LOGO_TOP_Y + 15); // Adjusted placeholder text position
    }

    // 3. Keep the subsequent text starting point relative to the original flow's y value (y=50)

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(MutedWhite);
    doc.text(
        trip?.title?.toUpperCase() || "TRIP DESTINATION",
        paddingX,
        y + 20 // This is y=50 + 20 = 70pt. This should be fine.
    );

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(MutedWhite);
    doc.text(
        trip?.title?.toUpperCase() || "TRIP DESTINATION",
        paddingX,
        y + 20
    );
    doc.text(travelerName || "Guest Traveler", paddingX, y + 35);

    // Booked Date (Top Right)
    doc.setFontSize(10);
    doc.text("BOOKED ON", pageWidth - paddingX, y + 20, { align: "right" });
    doc.setFontSize(14);
    doc.setTextColor("#ffffff");
    doc.setFont(undefined, "bold");
    doc.text(formattedBookedDate, pageWidth - paddingX, y + 35, {
        align: "right",
    }); // Using formattedDate

    // --- Ticket Codes Section (WEN, Guide ID, DST) ---
    y = HEADER_HEIGHT - 90; // Y position for the main codes

    const originCode = (trip?.location || "ABC").substring(0, 3).toUpperCase();
    const destCode = "DST"; // Using DST as per image example

    // Left Code (Origin)
    doc.setFontSize(36);
    doc.setFont(undefined, "bold");
    doc.setTextColor("#ffffff");
    doc.text(originCode, paddingX, y);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(MutedWhite);
    doc.text(trip?.title?.toUpperCase() || "TRIP TITLE", paddingX, y + 15);

    // Right Code (Destination)
    doc.setFontSize(36);
    doc.setFont(undefined, "bold");
    doc.setTextColor("#ffffff");
    doc.text(destCode, pageWidth - paddingX, y, { align: "right" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(MutedWhite);
    doc.text(
        trip?.location?.toUpperCase() || "LOCATION",
        pageWidth - paddingX,
        y + 15,
        { align: "right" }
    );

    // Center Guide ID Box (White Box)
    const centerX = pageWidth / 2;

    // --- 2. QR Code Area ---
    y = HEADER_HEIGHT + 40;

    // Embed QR Code
    const qrSize = 150;
    if (qrCodeDataURL) {
        doc.addImage(
            qrCodeDataURL,
            "PNG",
            centerX - qrSize / 2,
            y,
            qrSize,
            qrSize
        );
    } else {
        // Fallback placeholder if QR code data isn't provided
        doc.setFillColor(DarkText);
        doc.rect(centerX - qrSize / 2, y, qrSize, qrSize, "F");
        doc.setFontSize(10);
        doc.setTextColor("#ffffff");
        doc.text("QR Code Placeholder", centerX, y + qrSize / 2 + 3, {
            align: "center",
        });
    }

    y += qrSize + 40;

    // --- 3. Key Metrics Bar (Details Row) ---
    doc.setDrawColor("#DDDDDD");
    doc.setLineWidth(0.5);
    doc.line(paddingX, y, pageWidth - paddingX, y); // Top line

    y += 15;

    const textBaseY = y;
    const itemSpacing = (pageWidth - paddingX * 2) / 4;

    const metrics = [
        { icon: "ID", title: "Booking ID", value: bookingId },
        { icon: "GRP", title: "Travelers", value: `${groupSize} people` },
        {
            icon: "GUIDE",
            title: "Local guide",
            value: trip?.guide || "Guide Name",
        },
        { icon: "TIME", title: "Duration", value: trip?.duration || "2 days" },
    ];

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(GrayText);

    metrics.forEach((item, index) => {
        const x = paddingX + index * itemSpacing + itemSpacing / 2;

        // Placeholder Icon (Circle)
        doc.setFillColor("#");
        doc.setDrawColor(GrayText);
        doc.circle(x, textBaseY, 6, "FD"); // Filled white circle with gray border

        // Icon Text (Inside Circle - simple text placeholder)

        // Value Text (The main ID/number)
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.setTextColor(DarkText);
        doc.text(item.value, x, textBaseY + 20, { align: "center" });

        // Title Text
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.setTextColor(GrayText);
        doc.text(item.title, x, textBaseY + 30, { align: "center" });
    });

    y = textBaseY + 45;
    doc.line(paddingX, y, pageWidth - paddingX, y); // Bottom line
    y += 30;

    // --- 4. Total Paid Footer ---
    const FOOTER_HEIGHT = 45;
    const footerX = paddingX;

    doc.setFillColor(LightGreen);
    // Draw the light green box with a slight border/shadow effect (just draw box)
    doc.rect(footerX, y, pageWidth - footerX * 2, FOOTER_HEIGHT, "F");

    // "Total Paid" text
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(PrimaryGreen);
    doc.text("Total Paid", footerX + 15, y + FOOTER_HEIGHT / 2 + 3);

    // Amount text
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(PrimaryGreen);
    const formattedTotal = totalPaid?.toLocaleString() || "N/A";
    doc.text(
        `${formattedTotal} Br`,
        pageWidth - footerX - 15,
        y + FOOTER_HEIGHT / 2 + 5,
        { align: "right" }
    );

    // Save PDF
    doc.save(`Ticket-${bookingId}.pdf`);
};
