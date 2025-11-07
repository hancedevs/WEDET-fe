import React from "react";
import Image from "next/image";

function Logo() {
    return (
        <div className="w-full flex justify-center pt-6 ">
            <Image
                src="/header.svg"
                alt="Logo slider"
                width={180}
                height={180}
                priority
                className="object-contain h-auto w-44 sm:w-52 md:w-60"
            />
        </div>
    );
}

export default Logo;
