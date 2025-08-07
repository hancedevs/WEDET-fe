"use client";
import React from "react";
import Image from "next/image";
import { Users, MapPin, CalendarDays, Calendar, Clock } from "lucide-react";
import Pintick from "../../../../public/Pintick.png";
import QR_code from "../../../../public/QR_code.png";
import Img from "../../../../public/image2.jpg";
import NavBar from "@/app/components/ui/navBar";

function Pages() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* Adventure Booked Header */}
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
        className="w-[93%] max-w-md px-4 py-7 my-5 mx-auto"
        style={{
          backgroundColor: "#28B872",
          borderRadius: "2.3rem",
        }}
      >
        <div className="relative z-10 flex justify-between items-center">
          {/* Left Side */}
          <div>
            <h3 className="text-white text-xl font-bold">Digital Ticket</h3>
            <p className="text-white text-sm">Keep this safe for your trip</p>
          </div>

          {/* Right Side */}
          <div className="text-right ">
            <p className="text-white text-sm font-normal">Booking ID</p>
            <p className="text-white text-base font-semibold">WDT-2025-001</p>
          </div>
        </div>
      </div>
      {/* Ticket Summary */}
      <div className="flex items-center space-x-4 mt-6 w-[90%] max-w-md">
        {/* Image */}
        <div className="w-22 h-22 rounded-2xl overflow-hidden  flex-shrink-0">
          <Image
            src={Img}
            alt="Rainforest Adventure"
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Trip Info */}
        <div className="flex-1">
          <h1 className="text-black font-bold text-base">
            Rainforest Adventure
          </h1>
          <p className="text-gray-500 text-sm">wenchi, oromia</p>

          {/* Date and Duration */}
          <div className="flex items-center space-x-4 mt-1 text-black-500 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-green-600" />
              <span>May 20-28, 2024</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span>9 days</span>
            </div>
          </div>
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
            <p className="text-black font-semibold">Abebe Balcha</p>
          </div>
        </div>

        {/* Group Size */}
        <div className="flex items-start space-x-2">
          <Users className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Group Size</p>
            <p className="text-black font-semibold">2 people</p>
          </div>
        </div>

        {/* Guide */}
        <div className="flex items-start space-x-2">
          <MapPin className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Guide</p>
            <p className="text-black font-semibold">Oromia , Sebeta</p>
          </div>
        </div>

        {/* Booked On */}
        <div className="flex items-start space-x-2">
          <CalendarDays className="text-green-600 w-8 h-8 mt-1" />
          <div>
            <p className="text-gray-400 text-sm">Booked On</p>
            <p className="text-black font-semibold">27/07/2025</p>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300 my-6 w-[90%] max-w-md" />

      {/* QR Code with Payment Info */}
      <div className="flex flex-col items-center ">
        <div className="bg-green-100 p-5 rounded-3xl shadow-md flex items-center justify-center">
          <Image
            src={QR_code}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-xl"
          />
        </div>

        <hr className="border-t border-gray-300 my-6 w-[95%] max-w-md" />
        {/* Payment Info */}
        <div className="mt- mb-25 bg-gray-100 px-25 py-3 rounded-lg text-center shadow-sm">
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
