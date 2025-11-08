// components/auth/AuthInput.tsx

import * as React from "react";
import { Input } from "@/components/ui/input";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
    ({ className, isError, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                className={`
          rounded-full 
          h-auto // Allow padding to define height
          py-3.5 // Slightly adjusted padding for visual match
          pl-6 
          border-gray-200 
          placeholder:text-gray-300
          focus-visible:ring-[#28B872] 
          focus-visible:ring-offset-0 
          ${isError ? "border-red-500" : "border-gray-200"} 
          ${className}
        `}
                style={{
                    fontFamily: "'Red Hat'",
                    fontWeight: 300,
                }}
                {...props}
            />
        );
    }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };
