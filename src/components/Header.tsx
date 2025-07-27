import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellDot, MessageCircle, Search, Funnel } from "lucide-react";
import { Input } from "./ui/input";
function Header() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between mt-4 px-6 bg-white">
        <div className="flex gap-3 items-center">
          <Avatar className="h-15 w-15 border-2 border-green-500">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[15px] text-gray-600">Good morning. user</p>
            <h2 className="text-[19px] font-medium text-gray-900">
              Discover and go
            </h2>
          </div>
        </div>
        <div>
          <div className="flex gap-5">
            <div>
              <BellDot strokeWidth={1.5} />
              <span className="absolute top-9.5 right-17.5 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            <MessageCircle strokeWidth={1.5} />
          </div>
        </div>
      </div>
      <div className="flex flex-row  gap-7 items-center px-6">
        <div className="relative flex-1">
          <Input
            className="w-full pl-10 placeholder:text-gray-300 border-none focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
            placeholder="Search Destination"
          />
          <Search
            strokeWidth={0.75}
            className="absolute text-green-500 top-1/2 left-3 transform -translate-y-1/2"
          />
        </div>
        <div className="flex gap-2">
          <span>Filter</span>
          <Funnel strokeWidth={0.75} className="text-green-500" />
        </div>
      </div>
    </div>
  );
}

export default Header;
