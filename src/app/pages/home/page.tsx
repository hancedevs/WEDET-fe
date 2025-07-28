"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/ui/Header";
import { CategoriesSection } from "../../components/ui/category-section";
import { DestinationsSectionLoading } from "@/app/components/ui/destinations-section-loading";
import { DestinationsSection } from "@/app/components/ui/destinations-section";
import { CategoriesSectionLoading } from "@/app/components/ui/catagorie-section-loader";

const topRecommendedData = [
  {
    id: "1",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/fox.jpg",
  },
  {
    id: "2",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/fox.jpg",
  },
  {
    id: "3",
    name: "Place name",
    location: "Location",
    rating: 4.5,
    reviews: "400",
    image: "/fox.jpg",
  },
];

const tipsForYouData = [
  {
    id: "1",
    name: "Place name",
    location: "Location",
    price: "2,700Br",
    originalPrice: "3,000Br",
    duration: "2 day's trip",
    rating: 4.5,
    reviews: "400",
    agency: "Travel and tour agency name",
    discount: "15% OFF",
    image: "/fox.jpg",
  },
  {
    id: "2",
    name: "Place name",
    location: "Location",
    price: "Price",
    duration: "2 day's trip",
    rating: 4.5,
    reviews: "400",
    agency: "Travel and tour agency name",
    image: "/fox.jpg",
  },
];

function Page() {
  const [activeTab, setActiveTab] = useState("explore");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Header />

      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-28">
        {/* Top Recommended Section */}
        {isLoading ? (
          <DestinationsSectionLoading
            variant="small"
            layout="horizontal"
            count={3}
          />
        ) : (
          <DestinationsSection
            title="Top Recommended"
            destinations={topRecommendedData}
            variant="small"
            layout="horizontal"
          />
        )}

        {/* Categories Section */}
        {isLoading ? <CategoriesSectionLoading /> : <CategoriesSection />}

        {/* Tips for You Section */}
        {isLoading ? (
          <DestinationsSectionLoading
            variant="large"
            layout="vertical"
            count={2}
          />
        ) : (
          <DestinationsSection
            title="Tips for you"
            destinations={tipsForYouData}
            variant="large"
            layout="vertical"
          />
        )}
      </div>
    </div>
  );
}

export default Page;
