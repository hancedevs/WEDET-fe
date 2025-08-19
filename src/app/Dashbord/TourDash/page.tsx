"use client";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";
import React from "react";
import Image from "next/image";
import {
  Plus,
  Ticket,
  RotateCcw,
  StepForward,
  DollarSign,
  Circle,
} from "lucide-react";

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
}

const TripCard: React.FC<TripCardProps> = ({
  title,
  duration,
  price,
  capacity,
  date,
  day,
  total,
  bgcolor,
}) => {
  const badgeTextColor = bgcolor === "#FFEA00" ? "text-black" : "text-white";

  // Shadow color based on bgcolor
  const shadowColor = bgcolor ? `${bgcolor}30` : "#00000033"; //

  return (
    <div
      className="relative rounded-2xl p-4 flex justify-between items-center w-full mb-8"
      style={{
        boxShadow: `0 4px 15px ${shadowColor}`,
        backgroundColor: "white",
      }}
    >
      <div className="flex-1 mr-4">
        <span
          className={`absolute -top-4 right-6 text-xs px-3 py-1 rounded-full font-medium ${badgeTextColor}`}
          style={{ backgroundColor: bgcolor }}
        >
          {date}
        </span>

        <div>
          <p className="text-sm text-gray-500">Duration: {duration}</p>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{price} per person</p>
          <p className="text-gray-500">Capacity: {capacity}</p>
        </div>
      </div>
      <div className="flex flex-col items-center mr-4">
        <span className="text-5xl font-bold">{day}</span>
        <span className="text-sm font-semibold text-black-500">{total}</span>
        <button className="mt-2 px-4 py-1 rounded-full bg-[#28B872] text-white text-sm font-medium hover:bg-green-600 transition">
          Edit
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 pb-20">
        {/* Header */}
        <div className="flex items-center mb-10 mt-4 pr-3">
          <div className="relative w-20 h-20">
            <Image
              src="/man image.jpg"
              alt="User"
              fill
              className="rounded-full object-cover border-4 border-green-500"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-500">Good morning, user</p>
            <h1 className="text-lg font-bold">Discover and go</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 w-full">
          <div className="bg-white rounded-3xl shadow-[0_2px_4px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <Ticket className="text-green-500 w-8 h-8 mr-3" />
            <div>
              <p className="text-sm text-[#96A9AA]">Total Tickets</p>
              <h2 className="text-2xl font-bold">280</h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_4px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <div className="relative w-8 h-8 mr-3">
              <RotateCcw className="text-green-500 w-10 h-10" />
              <DollarSign className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/3 text-green-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#96A9AA]">Refund Request</p>
              <h2 className="text-xl font-bold">31</h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_4px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <StepForward className="text-green-500 w-8 h-8 mr-3" />
            <div>
              <p className="text-sm text-[#96A9AA]">Upcoming Trip</p>
              <h2 className="text-2xl font-semibold">Wenchi</h2>
              <span className="text-xs block -mt-1">
                <span className="text-red-500">01</span>
                <span className="text-green-500">/01/2025</span>
              </span>
            </div>
          </div>

          <div className="bg-[#F3FCFB] rounded-3xl shadow-[0_2px_4px_rgba(74,222,128,0.3)] p-4 flex items-center w-full">
            <Circle strokeWidth={3.5} className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-[#96A9AA]">Total Trips</p>
              <div className="flex items-baseline space-x-2">
                <h2 className="text-2xl font-bold">31</h2>
                <p className="text-sm font-semibold">Last Month</p>
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
        />
        <TripCard
          title="Wenchi"
          duration="2 days"
          price="$ 3,200"
          capacity={28}
          date="9/12/2025"
          day={26}
          total="19,000Br"
          bgcolor="#FF2D2D"
        />
      </div>

      <Navbar />
    </div>
  );
}
