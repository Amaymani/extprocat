"use client";
import React, { useState } from "react";

export default function WishlistModal({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (details: any) => void;
}) {
  const [form, setForm] = useState({
    userName: "",
    userPhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      Name: form.userName,
      Phone: form.userPhone,
      Address: {
        address_line_1: form.addressLine1,
        address_line_2: form.addressLine2,
        district_city: form.city,
        state_province: form.state,
        postal_Code: form.postalCode,
        country: form.country,
      },
    };
    onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="relative bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-200 p-8 tracking-wide animate-fadeIn"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-1 tracking-widest text-gray-800">
          Request Samples
        </h2>
        <p className="text-sm text-gray-500 mb-6 tracking-wider">
          Please provide your details so we can process your sample request.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          {[
            { name: "userName", label: "Full Name", required: true },
            { name: "userPhone", label: "Phone Number", required: true },
            { name: "addressLine1", label: "Address Line 1", required: true },
            { name: "addressLine2", label: "Address Line 2" },
            { name: "city", label: "City / District", required: true },
            { name: "state", label: "State / Province", required: true },
            { name: "postalCode", label: "Postal Code", required: true },
            { name: "country", label: "Country", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-1"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                required={field.required}
                value={(form as any)[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className="flex-1 px-4 py-2 border border-black rounded-full text-sm font-medium tracking-widest hover:bg-black hover:text-white transition"
          >
            SUBMIT
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium tracking-widest text-gray-600 hover:bg-gray-100 transition"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
