"use client";
import React, { useState } from "react";
import { ArrowLeft, CreditCard, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/navBar";

function ThickCheck({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M5 11.5L9 15L15 7.5"
        stroke="white"
        strokeWidth={2.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BookingPage() {
  const [seats, setSeats] = useState(4);
  const maxSeats = 14;
  const seatPrice = 575;
  const totalPrice = seats * seatPrice;
  const [bookingType, setBookingType] = useState("team");
  const [payment, setPayment] = useState("tell_birr");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      {/* Back button */}
      <button
        onClick={() => router.push("/pages/home")}
        className="fixed top-5 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#ECECEC] z-50 border-none"
      >
        <ArrowLeft size={24} className="text-[#28B872]" />
      </button>

      <div
        className="
          flex-1 w-full mx-auto flex flex-col gap-3
          pt-16 pb-24 px-2 sm:px-3 md:px-4
          max-w-[480px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[760px]
        "
        style={{ minHeight: "100vh" }}
      >
        <span className="text-sm font-bold text-[#BEBEBE] ml-2">
          Available space or seats
        </span>

        {/* Seats Card */}
        <div className="bg-white border-2 rounded-[26px] border-[#E8E8E8] shadow-[0_2px_8px_#00000010] px-4 py-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex flex-col justify-between gap-1">
              <span className="bg-[#28B872] text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-1">
                available
              </span>
              <span className="text-[1.5rem] font-bold text-[#28B872] leading-none mt-1">
                14 <span className="font-extrabold">Seats</span>
              </span>
              <span className="text-xs text-[#C7C7C7] font-bold mt-1">
                Select Number of seats
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {/* Plus button */}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#28B872] text-white text-xl font-bold active:scale-95 transition border border-[#28B872]"
                onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
                aria-label="Add seat"
              >
                +
              </button>
              {/* Minus button  */}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#28B872] text-xl font-bold active:scale-95 transition border border-[#28B872]"
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                aria-label="Remove seat"
              >
                –
              </button>
              {/* Count */}
              <span className="ml-2 px-6 py-2 bg-[#F4F4F4] text-[#4B4B4B] text-lg font-extrabold rounded-[20px] shadow-inner flex items-center justify-center min-w-[44px]">
                {seats}
              </span>
            </div>
          </div>
          {/* Price row */}
          <div className="flex justify-end">
            <span className="text-[#28B872] font-bold text-base">
              Total {totalPrice.toLocaleString()} Br
            </span>
          </div>
        </div>

        <span className="text-sm font-bold text-[#BEBEBE] ml-2 mt-4">
          Personalized booking
        </span>

        <div className="bg-white rounded-[26px] border-2 border-[#E8E8E8] shadow-[0_2px_8px_#00000010] px-4 py-4">
          <div className="flex flex-col gap-3">
            {/* Team */}
            <button
              className={`flex items-center border-2 gap-3 w-full px-2 py-3 rounded-full transition
                ${
                  bookingType === "team"
                    ? "border-2 border-[#28B872] shadow-[0_1.5px_8px_#28B87208] bg-white"
                    : "bg-white border border-[#E8E8E8]"
                }`}
              onClick={() => setBookingType("team")}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                  bookingType === "team"
                    ? "bg-[#28B872] border-[#28B872]"
                    : "border-[#BEBEBE] bg-white"
                }`}
              >
                {bookingType === "team" && <ThickCheck className="w-5 h-5" />}
              </span>
              <span
                className={`text-[1.05rem] font-bold ${
                  bookingType === "team" ? "text-[#28B872]" : "text-[#A9A9A9]"
                }`}
              >
                Team
              </span>
            </button>
            {/* Personal */}
            <button
              className={`flex items-center gap-3 border-2 w-full px-2 py-3 rounded-full transition
                ${
                  bookingType === "personal"
                    ? "border-2 border-[#28B872] shadow-[0_1.5px_8px_#28B87208] bg-white"
                    : "bg-white border border-[#E8E8E8]"
                }`}
              onClick={() => setBookingType("personal")}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                  bookingType === "personal"
                    ? "bg-[#28B872] border-[#28B872]"
                    : "border-[#BEBEBE] bg-white"
                }`}
              >
                {bookingType === "personal" && (
                  <ThickCheck className="w-5 h-5" />
                )}
              </span>
              <span
                className={`text-[1.05rem] font-bold ${
                  bookingType === "personal"
                    ? "text-[#28B872]"
                    : "text-[#A9A9A9]"
                }`}
              >
                Personal
              </span>
            </button>
          </div>
        </div>

        <span className="text-sm font-bold text-[#BEBEBE] ml-2 mt-4">
          Payment method
        </span>

        {/* Payment Method Card */}
        <div className="bg-white rounded-[28px] border-2 border-[#E8E8E8] shadow-[0_2px_8px_#00000010] px-4 py-4">
          <div className="flex gap-2">
            {/* Tell Birr */}
            <button
              className={`flex items-center gap-2 border-2 w-full justify-center py-2 rounded-full text-base font-bold transition
                ${
                  payment === "tell_birr"
                    ? "bg-[#28B872] text-white shadow-[0_1.5px_8px_#28B87222] border-none"
                    : "bg-white text-[#BEBEBE] border border-[#E8E8E8]"
                }`}
              onClick={() => setPayment("tell_birr")}
            >
              <CreditCard size={20} />
              Tell Birr
            </button>
            {/* Bank Transfer */}
            <button
              className={`flex items-center border-2 gap-2 w-full justify-center py-2 rounded-full text-base font-bold transition
                ${
                  payment === "bank_transfer"
                    ? "bg-[#28B872] text-white shadow-[0_1.5px_8px_#28B87222] border-none"
                    : "bg-white text-[#BEBEBE] border border-[#E8E8E8]"
                }`}
              onClick={() => setPayment("bank_transfer")}
            >
              <Landmark size={20} />
              Bank Transfer
            </button>
          </div>
        </div>

        {/* Summary Card  */}
        <div className="bg-white rounded-[26px] border-2 border-[#E8E8E8] shadow-[0_2px_8px_#00000010] px-4 py-4 flex flex-col mb-3">
          <div className="text-sm font-bold text-[#BEBEBE] mb-2">Summary</div>
          <div className="flex justify-between text-xs text-[#BEBEBE] font-bold mb-2">
            <span>Price</span>
            <span>{totalPrice.toLocaleString()} Br</span>
          </div>
          <div className="flex justify-between text-xs text-[#BEBEBE] font-bold mb-2">
            <span>Discount</span>
            <span>0.00 Br</span>
          </div>
          <div className="flex justify-between text-base font-bold mt-1">
            <span className="text-[#28B872]">Total due</span>
            <span className="text-[#28B872]">
              {totalPrice.toLocaleString()} Br
            </span>
          </div>
        </div>

        {/* PAY BUTTON */}
        <div className="w-full flex justify-center mb-4">
          <button className="w-full max-w-[370px] bg-[#28B872] text-white text-xl font-bold py-3 rounded-full shadow-[0_2px_12px_#28B87233]">
            pay
          </button>
        </div>
      </div>

      {/* NavBar  */}
      <div className="fixed left-0 right-0 bottom-0 z-40">
        <NavBar />
      </div>
    </div>
  );
}
