"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import WishlistModal from "@/components/WishlistModal";
import axios from "axios";

type ProductRecord = {
  ID: string;
  Product_Name?: string;
  Price?: number;
  Product_Images?: any[];
};

export default function Page() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await axios.get(`/api/fetch-products`);
      const data = res.data;
      console.log("Fetched products:", data);
      setProducts(data.data ?? []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(name: string) {
    setSelected(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  }

  async function submitWishlist(details: any) {
    try {
      const res = await fetch("/api/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected, details, products }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setSelected([]);
      } else {
        alert("❌ Failed to add items. Check console.");
        console.error(data);
      }
    } catch (err) {
      console.error("Error submitting wishlist:", err);
      alert("An unexpected error occurred.");
    } finally {
      setShowModal(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Product Catalogue
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => (
            <ProductCard
              key={p.ID}
              product={p}
              selected={selected.includes(p.Product_Name ?? "")}
              onToggle={() => toggleSelect(p.Product_Name ?? "")}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <button
          className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          onClick={() => {
            if (selected.length === 0)
              return alert("Please select at least one product.");
            setShowModal(true);
          }}
        >
          Add Selected to Wishlist
        </button>
      </div>

      {showModal && (
        <WishlistModal
          onCancel={() => setShowModal(false)}
          onSubmit={submitWishlist}
        />
      )}
    </main>
  );
}
