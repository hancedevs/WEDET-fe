"use client";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Reusable Card Component
interface TripCardProps {
  title: string;
  duration: string;
  price: string;
  capacity: number;
  date: string;
  day: number;
  total: string;
  bgcolor?: string;
  path: string;
}

const TripCard: React.FC<TripCardProps> = ({
  title,
  duration,
  price,
  capacity,
  date,
  day,
  total,
  bgcolor = "#28B872",
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("../BookingDetail/detail")}
      className="relative bg-white rounded-2xl p-4 flex justify-between items-center w-full mb-8 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
      style={{
        boxShadow: `0 4px 12px ${bgcolor}80`, // 80 = opacity for softer shadow
      }}
    >
      <div className="flex-1 mr-4">
        <span
          className="absolute -top-4 right-6 text-xs px-3 py-1 rounded-full font-medium"
          style={{
            backgroundColor: bgcolor,
            color:
              bgcolor === "#28B872" || bgcolor === "#FF2D2D"
                ? "white"
                : "black",
          }}
        >
          {date}
        </span>

        <div>
          <p className="text-sm text-[#B0C8C8]">Duration: {duration}</p>
          <h2 className="text-4xl font-semibold">{title}</h2>
          <p className="text-sm text-[#B0C8C8]">{price} per person</p>
          <p className="text-sm text-[#B0C8C8]">Capacity: {capacity}</p>
        </div>
      </div>
      <div className="flex flex-col items-center mr-4">
        <span className="text-5xl font-bold">{day}</span>
        <span className="text-sm font-semibold text-black-500">{total}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); //  Prevent parent click
            alert("Edit button clicked");
          }}
          className="mt-2 px-4 py-1 rounded-full bg-[#28B872] text-white text-sm font-medium hover:bg-green-600 transition"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 py pb-20">
        <div className="flex items-center mb-6 mt-4 pr-2">
          <div className="relative w-12 h-12">
            <Image
              src="/man image.jpg"
              alt="User"
              fill
              className="rounded-full object-cover border-2 border-green-500"
            />
          </div>
          <div className="ml-2">
            <p className="text-xs">Good morning, user</p>
            <h1 className="text-lg font-semibold">Discover and go</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 w-full">
          <div className="bg-white rounded-2xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <Image
              src="/Tickets.png"
              alt="Ticket"
              width={40}
              height={40}
              className="w-10 h-10 mr-3"
            />
            <div>
              <p className="text-xs text-[#96A9AA]">Total Tickets</p>
              <h2 className="text-2xl font-bold">280</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <div className="flex-shrink-0 mr-3">
              <Image
                src="/refund.png"
                alt="Refund"
                width={48}
                height={48}
                className="object-contain w-10 h-10"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#96A9AA] whitespace-nowrap truncate">
                Refund Request
              </p>
              <h2 className="text-2xl font-bold">31</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <Image
              src="/Next (1).png"
              alt="Ticket"
              width={40}
              height={40}
              className="w-10 h-10 mr-3"
            />
            <div>
              <p className="text-xs text-[#96A9AA]">Upcoming Trip</p>
              <h2 className="text-2xl font-semibold">Wenchi</h2>
              <span className="text-xs block -mt-1">
                <span className="text-red-500">01</span>
                <span className="text-green-500">/01/2025</span>
              </span>
            </div>
          </div>
          <div className="bg-[#F3FCFB] rounded-2xl shadow-[0_4px_6px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <Image
              src="/trip origin.png"
              alt="Ticket"
              width={40}
              height={40}
              className="w-10 h-10 mr-3"
            />
            <div>
              <p className="text-xs text-[#96A9AA]">Total Trips</p>
              <div className="flex items-baseline space-x-2">
                <h2 className="text-2xl font-bold">31</h2>
                <p className="text-xs font-semibold">Last Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trips Section */}
        <div className="flex justify-between items-center mb-6 w-full">
          <h2 className="text-lg font-bold">Trips</h2>
          <button className="flex items-center gap-1 text-green-600 font-medium hover:underline">
            <Plus className="w-4 h-4" /> Add Trip
          </button>
        </div>

        {/* Trip List */}
        <TripCard
          title="Wenchi"
          duration="2 days"
          price="$ 3,200"
          capacity={28}
          date="9/12/2025"
          day={24}
          total="19,000Br"
          bgcolor="#FFEA00"
          path="/trips/wenchi"
        />
        <TripCard
          title="Suba"
          duration="2 days"
          price="$ 2,800"
          capacity={20}
          date="9/12/2025"
          day={2}
          total="19,000Br"
          bgcolor="#28B872"
          path="/trips/suba"
        />
        <TripCard
          title="Entoto"
          duration="2 days"
          price="$ 3,200"
          capacity={28}
          date="9/12/2025"
          day={26}
          total="19,000Br"
          bgcolor="#FF2D2D"
          path="/trips/entoto"
        />
      </div>

      <Navbar />
    </div>
  );
}
