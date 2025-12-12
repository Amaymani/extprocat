import React from "react";
import { parseZohoImage } from "../lib/zoho";
import ImageWithSkeleton from "./ImageWithSkeleton";

type Props = {
  product: any;
  selected: boolean;
  onToggle: () => void;   // toggles selection
  onDetails?: () => void; // opens details modal
};

export default function ProductCard({ product, selected, onToggle, onDetails }: Props) {
  const name = product.Product_Name ?? "Unnamed Product";
  const img = parseZohoImage(product.Product_Images?.[0]);

  return (
    <div
      className="group relative w-[125px] cursor-pointer"
      onClick={() => onToggle()}
    >
      <div className="relative overflow-hidden rounded-lg bg-white shadow">
        <div className="aspect-square relative">
          <ImageWithSkeleton src={img} alt={name} sizes="(max-width: 768px) 50vw, 33vw" />

          {/* Hover overlay with buttons */}
          <div
            className={[
              "absolute inset-0 flex flex-col items-center justify-center space-y-2 transition-opacity duration-150 z-20",
              selected
                ? "opacity-0 pointer-events-none"
                : "opacity-0 group-hover:opacity-100 pointer-events-none",
            ].join(" ")}
          >
            <button
              className="bg-white rounded-md border border-gray-300 w-[90px] py-1.5 text-sm hover:bg-gray-50 shadow-sm pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                onDetails?.();
              }}
            >
              Details
            </button>
            <button
              className="bg-white rounded-md border border-gray-300 w-[90px] py-1.5 text-sm hover:bg-gray-50 shadow-sm pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                onToggle();
              }}
            >
              {selected ? "Remove Sample" : "Add Sample"}
            </button>
          </div>

          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
              <div className="h-10 w-10 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-semibold">✓</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-center">
        <h3 className="text-sm font-medium leading-tight">{name}</h3>
      </div>
    </div>
  );
}
