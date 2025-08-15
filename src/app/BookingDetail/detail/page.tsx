"use client";

import React from "react";
import { ArrowLeft, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Detailfilter from "@/app/components/ui/Detailfilter";
import Navbar from "@/app/components/Tourguidecomponents/TourGuideNavbar";

interface TripCardProps {
  date: string;
  duration: string;
  title: string;
  pricePerPerson: string;
  capacity: number;
  seatLeft: number;
  seatsBooked: number;
  seatsPending: number;
  totalPrice: string;
  onPassengerListClick?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({
  date,
  duration,
  title,
  pricePerPerson,
  capacity,
  seatLeft,
  seatsBooked,
  seatsPending,
  totalPrice,
  onPassengerListClick,
}) => {
  return (
    <div className="mx-4 my-2 p-4 border border-green-400 rounded-2xl bg-green-50">
      <div className="flex justify-between font-bold text-sm text-gray-600 mb-2">
        <span>{date}</span>
        <span>Duration: {duration}</span>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-500 text-sm">{pricePerPerson} per person</p>
          <p className="text-gray-400 text-sm">Capacity: {capacity}</p>
          <p className="text-gray-400 text-sm">Seat Left: {seatLeft}</p>
        </div>

        <div className="text-right mt-5">
          <p className="text-lg">
            <span className="text-green-500 font-semibold">{seatsBooked}</span>
            <span className="text-red-500 font-semibold">/{seatsPending}</span>
            <span className="text-xs text-red-500 ml-1">Seats</span>
          </p>
          <p className="text-3xl font-bold">{totalPrice}</p>
        </div>
      </div>

      <button
        onClick={onPassengerListClick}
        className="mt-4 px-4 py-2 rounded-full bg-[#28B872] text-white text-sm font-semibold"
      >
        Passenger List
      </button>
    </div>
  );
};

export default function TourPage() {
  const router = useRouter();

  const trips = [
    {
      date: "01/10/2025",
      duration: "2 days",
      title: "Wenchi",
      pricePerPerson: "2,700",
      capacity: 26,
      seatLeft: 16,
      seatsBooked: 20,
      seatsPending: 3,
      totalPrice: "27,000Br",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200"
        >
          <ArrowLeft className="text-green-600" size={30} />
        </button>
        <div>
          <h1 className="text-lg font-bold">Wenchi Trip</h1>
          <p className="text-sm font-bold text-gray-500">Details</p>
        </div>
      </div>

      {/* Render Trip Cards */}
      {trips.map((trip, index) => (
        <TripCard
          key={index}
          {...trip}
          onPassengerListClick={() => alert(`Passenger List for ${trip.title}`)}
        />
      ))}

      {/* Main Content */}
      <div className="flex-1">
        <Detailfilter />
      </div>

      {/* Edit Button */}
      <div className="px-4 mt-3 mb-30 flex items-center justify-center">
        <button
          onClick={() => alert("Edit clicked")}
          className="w-20  gap-2 px-4 py-2 rounded-full bg-[#28B872] hover:bg-green-600 text-white font-semibold transition-colors"
        >
          Edit
        </button>
      </div>
      <Navbar active="explore" />
    </div>
  );
}
