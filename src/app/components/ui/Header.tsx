import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellDot, MessageCircle, Search, Funnel } from "lucide-react";
import { Input } from "@/components/ui/input";
function Header() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mt-4 px-3">
        <div className="flex gap-3 items-center">
          <Avatar className="h-13 w-13 border-2 border-green-500">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[15px] text-gray-600">Good morning,user</p>
            <h2 className="text-[19px] font-medium text-gray-900">
              Discover and go
            </h2>
          </div>
        </div>
       <div className="flex items-center gap-5">
  <div className="relative inline-block">
    <BellDot className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1} />
    <span className="absolute top-1 right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border border-white transform translate-x-1/4 -translate-y-1/4"></span>
  </div>
  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
</div>

      </div>
      <div className="flex flex-row  gap-7 items-center px-3">
        <div className="relative flex-1 ">
          <Input
            className="w-full rounded-3xl pl-10 placeholder:text-gray-300 
             border border-[#C0C0C0] 
             focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
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
