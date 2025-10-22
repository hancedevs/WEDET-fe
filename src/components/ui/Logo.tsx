import React from "react";
import Image from "next/image";
import logoImage from "../../../public/Header.jpg";
function Logo() {
    return (
        <div className=" py-8">
            <Image
                src={logoImage}
                alt="Logo slider"
                quality={80}
                className="mx-auto"
            />
        </div>
    );
}

export default Logo;
