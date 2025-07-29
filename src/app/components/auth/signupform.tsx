"use client";
import { useState } from "react";
import Logo from "../ui/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Signupform() {
  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      password: "",
      agreeToTerms: false,
    });
  };

  return (
    <div  style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 300 }}>
        <Logo/>
    <div className=" absolute top-30 w-full  bg-white flex flex-col  rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
      <div className="max-w-sm mx-auto">
        <h2 className="text-xl px-10 mt-3 font-bold text-[#959494]">
          Create your account
        </h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className=" px-10 sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols gap-y-8 gap-x-4 sm:grid-cols">
              <div className="mt-1">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                  placeholder="First Name"
                />
              </div>
              <div className="mt-1">
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                  placeholder="Last Name"
                />
              </div>
              <div className="mt-1">
                <Input
                  name="dateOfBirth"
                  type={dateType}
                  value={formData.dateOfBirth}
                  onFocus={() => setDateType("date")}
                  onBlur={() => formData.dateOfBirth === "" && setDateType("text")}
                  onChange={handleChange}
                  className=" rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                  placeholder="Date of birth"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium px-3 text-gray-300">
                  Gender
                </label>
                <div className="mt-4 flex space-x-4 px-4">
                  <div className="flex items-center">
                    <Input
                      id="male"
                      name="gender"
                      type="radio"
                      value="male"
                      className="h-4 w-4 accent-green-600"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="male"
                      className="ml-2 block text-sm text-green-500"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Input
                      id="female"
                      name="gender"
                      type="radio"
                      value="female"
                      className=" h-4 w-4 accent-green-600"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="female"
                      className="ml-2 block text-sm text-green-500"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                  placeholder="Email"
                />
              </div>
              <div className="mt-1">
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-3xl p-6 border-none shadow placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                  placeholder="New Password"
                />
              </div>
            </div>
            <div className="flex items-center max-w-80  text-center">
              <label
                htmlFor="agreeToTerms"
                className="text-sm font-medium mt-4 text-[#959494]"
              >
                By selecting Create account I agree to wedet&apos;s terms of
                service, policy and acknowledge the privacy policy.
              </label>
            </div>
            <div>
              <Button
                type="submit"
                className=" mx-auto flex  p-6 px-28 rounded-3xl bg-[#28b872] hover:bg-[#28b875] font-semibold"
              >
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
