"use client";
import React from "react";
import Image from "next/image";
import { Users, MapPin, CalendarDays } from "lucide-react";
import Pintick from "../../../../public/Pintick.png";
import QR_code from "../../../../public/QR_code.png";
import NavBar from "@/app/components/ui/navBar";

function Pages() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* Adventure Booked */}
      <div
        className="w-full max-w-md flex flex-col items-center px-6 py-8 shadow-lg"
        style={{ backgroundColor: "#28B872" }}
      >
        <Image
          src={Pintick}
          alt="Pintick"
          width={120}
          height={120}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-white">Adventure Booked</h1>
      </div>

      {/* Digital Ticket */}
      <div
        className="w-[95%] max-w-md px-6 py-5 my-6 mx-auto"
        style={{
          backgroundColor: "#28B872",
          borderRadius: "2rem",
        }}
      >
        <div className="relative z-10 flex justify-between items-center">
          {/* Left Side */}
          <div>
            <h3 className="text-white text-xl font-bold">Digital Ticket</h3>
            <p className="text-white text-sm">Keep this safe for your trip</p>
          </div>

          {/* Right Side */}
          <div className="text-right">
            <p className="text-white text-sm font-normal">Booking ID</p>
            <p className="text-white text-base font-semibold">WDT-2024-001</p>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-6 w-[90%] max-w-md" />

      {/* Detail Info */}
      <div className="w-[95%] max-w-md grid grid-cols-2 gap-y-6 gap-x-4 px-2 py-4">
        {/* Traveler */}
        <div className="flex items-start space-x-2">
          <Users className="text-green-600 w-9 h-9 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Traveler</p>
            <p className="text-black font-semibold">Abebe Balcha</p>
          </div>
        </div>

        {/* Group Size */}
        <div className="flex items-start space-x-2">
          <Users className="text-green-600 w-9 h-9 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Group Size</p>
            <p className="text-black font-semibold">2 people</p>
          </div>
        </div>

        {/* Guide */}
        <div className="flex items-start space-x-2">
          <MapPin className="text-green-600 w-9 h-9 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Guide</p>
            <p className="text-black font-semibold">Oromia , Sebeta</p>
          </div>
        </div>

        {/* Booked On */}
        <div className="flex items-start space-x-2">
          <CalendarDays className="text-green-600 w-9 h-9 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Booked On</p>
            <p className="text-black font-semibold">27/07/2025</p>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-6 w-[90%] max-w-md" />

      {/* QR code with payment info */}
      <div className="flex flex-col items-center mt-6">
        {/* QR code box */}
        <div className="bg-green-100 p-4 rounded-3xl shadow-md flex items-center justify-center">
          <Image
            src={QR_code}
            alt="QR Code"
            width={180}
            height={180}
            className="rounded-xl"
          />
        </div>

        {/* Payment Info */}
        <div className="mt-5 mb-40 bg-gray-100 px-30 py-3 rounded-lg text-center shadow-sm">
          <p className="text-gray-500 text-sm">Total Paid</p>
          <h3 className="text-green-600 font-bold text-xl">2,900Br</h3>
          <p className="text-gray-500 text-sm">Payment confirmed</p>
        </div>
        <NavBar />
      </div>
    </div>
  );
}

export default Pages;
