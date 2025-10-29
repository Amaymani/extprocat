// components/WishlistModal.tsx
import React, { useState } from "react";

export default function WishlistModal({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (details: any) => void }) {
  const [form, setForm] = useState({ userName: "", userPhone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "" });

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
      }
    };
    onSubmit(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form className="bg-white rounded-lg p-6 w-80" onSubmit={submit}>
        <h3 className="text-lg font-semibold mb-3">Enter Your Details</h3>
        <input required name="userName" value={form.userName} onChange={handleChange} placeholder="Full Name" className="w-full mb-2 p-2 border rounded" />
        <input required name="userPhone" value={form.userPhone} onChange={handleChange} placeholder="Phone Number" className="w-full mb-2 p-2 border rounded" />
        <input required name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Address Line 1" className="w-full mb-2 p-2 border rounded" />
        <input name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Address Line 2" className="w-full mb-2 p-2 border rounded" />
        <input required name="city" value={form.city} onChange={handleChange} placeholder="City / District" className="w-full mb-2 p-2 border rounded" />
        <input required name="state" value={form.state} onChange={handleChange} placeholder="State / Province" className="w-full mb-2 p-2 border rounded" />
        <input required name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="w-full mb-2 p-2 border rounded" />
        <input required name="country" value={form.country} onChange={handleChange} placeholder="Country" className="w-full mb-3 p-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Submit</button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 p-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
