"use client";
import React, { useState } from "react";
import Image from "next/image";

type CardContent = {
  title: string;
  description: string;
  buttonText: string;
  footer?: string;
  image: string;
  image1: string;
};

const cards: CardContent[] = [
  {
    title: "X/ weder",
    description:
      "description description description description description description description description ",
    buttonText: "Book now!",
    footer: "KURIFTU RESORTS",
    image: "/image1.jpg",
    image1: "/boredim.png",
  },
  {
    title: "Adventure Package",
    description:
      "Experience the ultimate jungle adventure with our expert guides",
    buttonText: "Explore",
    footer: "WILDLIFE TOURS",
    image: "/image2.jpg",
    image1: "/boredim2.png",
  },
  {
    title: "Luxury Stay",
    description: "Premium accommodations with breathtaking views of the nature",
    buttonText: "Reserve",
    footer: "PREMIUM RESORTS",
    image: "/fox.jpg",
    image1: "/boredim.png",
  },
];

export default function ResortPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative max-w-4xl mt-5 mx-auto">
      <div className="relative border border-green-500 mb-8 h-66 w-full overflow-visible rounded-[35px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center">
              <div className="flex justify-between w-full p-4">
                <div className="flex-1 flex justify-start">
                  <Image
                    src="/wedet-logo.png"
                    alt="logo"
                    width={200}
                    height={100}
                    className="max-h-14 w-auto object-contain"
                  />
                </div>

                <div className="flex-1 flex justify-end">
                  <Image
                    src="/kuriftu logo.png"
                    alt="logo"
                    width={200}
                    height={100}
                    className="max-h-14 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="px-6">{card.description}</p>
            </div>

            <div className="flex justify-between">
              <button className="border text-white bg-[#28B872] m-8 px-5 py-2 rounded-[35px]">
                {card.buttonText}
              </button>
            </div>

            <div className="absolute bottom-[-30px] right-[-14px] z-10">
              <Image
                key={index}
                src={card.image1}
                alt="decoration"
                width={200}
                height={100}
                quality={80}
                className="w-[150px] sm:w-[150px] md:w-[200px] h-auto"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 mb-8 mx-auto w-fit flex gap-2">
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
    </div>
  );
}
