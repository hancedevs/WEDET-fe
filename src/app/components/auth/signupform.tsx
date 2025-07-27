"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AccountForm() {
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
    <div className="absolute top-18 w-full mt-6 bg-white flex flex-col border-2 rounded-t-3xl justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-xl px-10 font-bold text-[#959494]">
          Create your account
        </h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className=" px-10 sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
                  value={formData.dateOfBirth}
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
            <div className="flex items-center max-w-80 ml-10 text-center">
              <label
                htmlFor="agreeToTerms"
                className="text-sm font-medium text-[#959494]"
              >
                By selecting Create account I agree to wedet&apos;s terms of
                service, policy and acknowledge the privacy policy.
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="w-fit mx-auto flex justify-center py-2 px-30 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}