import React from "react";
import logo from "../../public/Header.jpg";
import Image from "next/image";
function Logo() {
  return (
    <div className="bg-[#242E3A] py-4">
      <Image src={logo} 
      alt="Logo Image" 
      className="mx-auto"/>
    </div>
  );
}

export default Logo;
