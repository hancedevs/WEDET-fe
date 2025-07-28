import React from "react";
import Logo from "@/app/components/ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
function Forgotpassword() {
  return (
    <div
      style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 300 }}
    >
      <Logo />
      <div className=" absolute  top-28 w-full bg-white flex flex-col border-t-2 rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-xl px-10 font-bold text-[#959494]">
            Forgot Password
          </h2>
          <p className="px-10 mt-4 text-gray-500">
            Enter Email associated with the acount to send you a password reset
            link
          </p>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" px-10 sm:rounded-lg sm:px-10">
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="mt-1">
                  <Input
                    name="firstName"
                    className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                    placeholder="Enter Email"
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className=" mx-auto flex justify-center py-6 px-27 rounded-3xl bg-green-600 font-medium text-lg"
                  >
                    Send me link
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;
