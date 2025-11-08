// components/ui/PrimaryButton.tsx

import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface PrimaryButtonProps extends ButtonProps {}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    className,
    ...props
}) => {
    return (
        <Button
            className={`
        w-full 
        rounded-full 
        py-4 
        bg-[#28B872] 
        hover:bg-[#1f9d62] 
        text-white 
        disabled:opacity-60
        h-auto // Ensure padding dictates height
        ${className}
      `}
            style={{
                fontFamily: "'Red Hat', sans-serif",
                fontWeight: 300,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export { PrimaryButton };
