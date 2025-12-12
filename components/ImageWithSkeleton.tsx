"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    quality?: number;
    priority?: boolean;
    unoptimized?: boolean;
}

export default function ImageWithSkeleton({
    src,
    alt,
    className,
    sizes = "(max-width: 768px) 100vw, 50vw",
    quality,
    priority = false,
    unoptimized = false,
}: ImageWithSkeletonProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (src) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [src]);

    return (
        <>
            {loading && (
                <div className="absolute inset-0 bg-gray-200 z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
            )}
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    quality={quality}
                    priority={priority}
                    unoptimized={unoptimized}
                    className={`object-cover transition-all duration-700 ease-out ${loading ? "opacity-0 scale-105 blur-md" : "opacity-100 scale-100 blur-0"
                        } ${className || ""}`}
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                />
            ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="text-xs">No Image</span>
                </div>
            )}
        </>
    );
}
