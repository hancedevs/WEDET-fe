"use client";
import React, { useState } from "react";
import Image from "next/image";
type CardContent = {
  title: string;
  description: string;
  buttonText: string;
  footer?: string;
  image: string;
};
const cards: CardContent[] = [
  {
    title: "X/ weder",
    description:
      "cfgeasuvhref f iebyskhv o uhvbk sk cfgeasuvhref f iebyskhv ouhvbk sk",
    buttonText: "Book now!",
    footer: "KURIFTU RESORTS",
    image: "/image1.jpg",
  },
  {
    title: "Adventure Package",
    description:
      "Experience the ultimate jungle adventure with our expert guides",
    buttonText: "Explore",
    footer: "WILDLIFE TOURS",
    image: "/image2.jpg",
  },
  {
    title: "Luxury Stay",
    description: "Premium accommodations with breathtaking views of the nature",
    buttonText: "Reserve",
    footer: "PREMIUM RESORTS",
    image: "/fox.jpg",
  },
];
export default function ResortPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative border border-green-500 h-66 w-full overflow-hidden rounded-[35px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center">
              <Image
                src="/Header.jpg"
                alt="logo"
                width={200}
                height={100}
                className="p-8"
              />
              <h2 className="text-green-700 font-bold">{card.footer}</h2>
            </div>
            <div>
              <p className="px-6 w-[250px]">{card.description}</p>
            </div>
            <div className="flex justify-between">
              <button className="border text-white bg-[#28B872] m-8 px-5 py-2 rounded-[35px]">
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className=" mt-2 mx-auto w-fit transform -translate-x-1/2 flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-green-600" : "bg-green-200"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button className="w-full bg-[#28B872] hover:bg-[#28B880] text-white py-3 mt-4 rounded-[35px] font-bold transition-colors mb-6">
        Book now!
      </button>
    </div>
  );
}
