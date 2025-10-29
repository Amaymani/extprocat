// components/ProductCard.tsx
import React from "react";
import { parseZohoImage } from "../lib/zoho";

type Props = {
  product: any;
  selected: boolean;
  onToggle: () => void;
};

export default function ProductCard({ product, selected, onToggle }: Props) {
  const name = product.Product_Name ?? "Unnamed Product";
  const price = product.Price ? `₹${product.Price}` : "";
  const img = parseZohoImage(product.Product_Images?.[0]);

  return (
    <div className="relative bg-white rounded-xl shadow p-3 transform transition hover:-translate-y-1">
      <label className="absolute top-3 right-3 cursor-pointer z-10">
        <input className="hidden" type="checkbox" checked={selected} readOnly onClick={onToggle} />
        <span className={`inline-block w-6 h-6 rounded-full ${selected ? "bg-red-500" : "bg-gray-200"}`}/>
      </label>
      <img src={img} alt={name} className="w-full h-40 object-contain mb-3" />
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500">{price}</p>
      </div>
      <div className="mt-2">
        <button className="mt-3 px-3 py-1 text-sm rounded border" onClick={onToggle}>{selected ? "Unselect" : "Select"}</button>
      </div>
    </div>
  );
}
