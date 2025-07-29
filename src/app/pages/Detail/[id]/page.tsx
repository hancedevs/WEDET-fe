"use client";
import React from "react";
import Image from "next/image";
import Detailfilter from "@/app/components/ui/Detailfilter";
import { Star, MapPin, User, Calendar, Users, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ResortPage from "@/app/components/ui/Bilbord";
export default function TourPage() {
  return (
    <div className=" w-full mx-auto bg-white">
      <div className="relative h-74 w-full">
        <Image
          src="/image1.jpg"
          alt="Wenchi Park"
          fill
          quality={80}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-30 right-4  rounded-lg p-3 text-right">
          <div className="bg-red-600 rounded-3xl text-white px-3 font-bold text-sm">
            Save 15%
          </div>
          <div className="text-green-600 font-bold text-xl">2,700 Br</div>
          <div className="text-red-500 text-sm line-through">3,000 Br</div>
          <div className="text-green-500 text-xs">per person</div>
        </div>
      </div>
      <div className="bg-white absolute top-65 border border-white rounded-t-4xl p-5">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Wenchi Park, Oromia</h1>
          <div className="flex items-center mt-1 gap-2">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">4.7</span>
            </div>
            <span className="text-gray-500 text-sm">(158 reviews)</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Moderate
            </span>
          </div>
          <div className="flex items-center mt-2 text-gray-400 text-sm">
            <MapPin size={14} className="mr-1 text-green-500" />
            <span>Location</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["Wildlife", "Jungle", "Culture", "Wildlife"].map((tag, i) => (
              <span
                key={i}
                className="border border-gray-300 text-black font-semibold rounded-full px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 border border-gray-300 px-4 py-4 rounded-4xl mt-2 grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-medium text-green-700">2 Days</div>
            </div>
          </div>
          <div className="flex items-center">
            <Users size={16} className="text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Group Size</div>
              <div className="font-medium text-green-700">Max 10</div>
            </div>
          </div>
          <div className="flex items-center">
            <User size={16} className="text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-500">Min Age</div>
              <div className="font-medium text-green-700">14+</div>
            </div>
          </div>
        </div>

        <div className=" shadow-lg flex flex-col rounded-[35px] p-3">
          <div className="flex gap-2 justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-15 w-15 border-2 border-green-500">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="User Avatar"
                />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="font-bold">Abebe Balcha</h3>
                  <BadgeCheck strokeWidth={1.25} className="text-green-700" />
                </div>
                <p className="text-gray-500 text-sm">18 years experience</p>
              </div>
            </div>
            <div className="flex items-center mb-3 mr-3">
              <Star size={16} className="text-yellow-500" />
              <span className="ml-1 text-sm font-medium">4.7</span>
            </div>
          </div>
          <p className="text-gray-400 px-6 text-justify mb-4">
            Carlos is a naturalist guide born in the Amazon basin. His
            encyclopedic knowledge of rainforest ecology combined with his
            ability to spot even the most elusive wildlife, makes him one of
            Perus most respected jungle guides.
          </p>
          <div className="flex  px-4 flex-wrap gap-1 mb-3">
            {["Wildlife", "Jungle", "Culture", "Wildlife"].map((tag, i) => (
              <span
                key={i}
                className="border border-gray-200 text-black rounded-full px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Detailfilter />

        <div className="mt-6 px-2">
          <h2 className="text-xl font-semibold text-black mb-2">
            About this Adventure
          </h2>
          <p className="text-gray-400 mb-6">
            Immerse yourself in the worlds most biodiverse ecosystem on this
            comprehensive Amazon adventure. From the bustling river port of
            Iquitos, journey deep into pristine rainforest where pink dolphins
            play, colorful birds fill the canopy, and indigenous communities
            maintain ancient traditions. This expedition offers unparalleled
            wildlife encounters and cultural experiences.
          </p>
        </div>
        <div className="mt-6 px-2">
          <h2 className="text-xl font-semibold text-black mb-2">
            Top Highlights
          </h2>
          <div className="text-gray-400 mb-6">
            <ul className="list-disc px-4">
              <li>Spot pink river dolphins and giant otters</li>
              <li>Night walks to discover nocturnal wildlife</li>
              <li>Visit indigenous communities and learn traditional skills</li>
              <li>Canopy walks 40 meters above the forest floor</li>
              <li>Piranha fishing and caiman spotting</li>
              <li>Learn about medicinal plants from shamans</li>
              <li>Navigate tributaries by traditional canoe</li>
            </ul>
          </div>
        </div>
        <ResortPage />
      </div>
    </div>
  );
}
