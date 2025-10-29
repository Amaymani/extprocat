"use client";
import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import WishlistModal from "@/components/WishlistModal";
import axios from "axios";
import { parseZohoImage } from "@/lib/zoho";

type ProductRecord = {
  ID: string;
  Product_Name?: string;
  Product_Images?: any[];
  Company_Name?: string;
  Product_Description?: string;
};

function extractImageUrls(rec?: ProductRecord | null): string[] {
  if (!rec?.Product_Images?.length) return [];
  return rec.Product_Images.map((it: any) => parseZohoImage(it)).filter(
    Boolean
  );
}

export default function Page() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsProduct, setDetailsProduct] = useState<ProductRecord | null>(
    null
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/fetch-products`);
      const data = res.data;
      setProducts(data.data ?? []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(name: string) {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  const currentImages = useMemo(
    () => extractImageUrls(detailsProduct),
    [detailsProduct]
  );
  useEffect(() => setCarouselIndex(0), [detailsProduct]);

  function onDetails(p: ProductRecord) {
    setDetailsProduct(p);
  }

  //use /api/submit-request to submit the selected products in the modal

  const submitRequest = async (details: any) => {
    try {
      const res = await axios.post(`/api/submit-request`, {
        selected: selectedNames,
        details,
        products,
      });
      const data = res.data;
      alert(data.message || "Request submitted successfully!");
      setShowModal(false);
      setSelectedNames([]);
    } catch (err) {
      console.error("Failed to submit request:", err);
      alert("Failed to submit request. Please try again later.");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-10 font-sans text-gray-800 tracking-wide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* LEFT COLUMN — square image with overlay name and details below */}
        <div className="space-y-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            {currentImages.length > 0 ? (
              <>
                <img
                  src={currentImages[carouselIndex]}
                  alt={detailsProduct?.Product_Name ?? "Selected Product"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {detailsProduct?.Product_Name && (
                  <div className="absolute top-5 left-5 text-white text-3xl font-semibold tracking-wider drop-shadow-md">
                    {detailsProduct.Product_Name}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                <div className="w-24 h-24 bg-gray-200 rounded mb-4"></div>
                <p>Select a product to preview</p>
              </div>
            )}
          </div>

          {detailsProduct && (
            <div className="text-left">
              <h2 className="text-3xl font-semibold mb-1 tracking-widest">
                {detailsProduct.Product_Name}
              </h2>
              <p className="text-sm text-gray-500 uppercase tracking-[0.15em]">
                {detailsProduct.Company_Name}
              </p>
              <p className="text-gray-700 mt-4 text-base leading-relaxed tracking-wide">
                {detailsProduct.Product_Description}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — title + info + product grid */}
        <div>
          <h1 className="text-4xl font-semibold mb-2 tracking-widest">
            Colours & Finishes
          </h1>
          <h3 className="text-lg text-gray-500 mb-4 tracking-widest">
            色 & 仕上げ
          </h3>

          <p className="text-gray-700 leading-relaxed mb-10 tracking-wide">
            Ever Art Wood® and Ever Art® Metallic finishes offer exceptional
            realism, superior durability and fade resistance. In addition, their
            fire testing performance ensures they are ideal for both exterior
            and interior applications. With a low light reflectance value, they
            provide a refined, sophisticated aesthetic.
          </p>

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard
                  key={p.ID}
                  product={p}
                  selected={selectedNames.includes(p.Product_Name ?? "")}
                  onToggle={() => toggleSelect(p.Product_Name ?? "")}
                  onDetails={() => onDetails(p)}
                />
              ))}
            </div>
          )}

          <div className="mt-12">
            <button
              className="px-6 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition tracking-widest"
              onClick={() => {
                if (selectedNames.length === 0)
                  return alert("Please select at least one product.");
                setShowModal(true);
              }}
            >
              REQUEST SAMPLES
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <WishlistModal
          onCancel={() => setShowModal(false)}
          onSubmit={submitRequest}
        />
      )}
    </main>
  );
}
