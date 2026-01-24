'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
}

const PLACEHOLDER_IMAGE = '/placeholder.svg';

export function LazyImage({ src, alt, className }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Ensure we never pass an empty string to src
    const imageSrc = src && src.trim() !== '' ? src : PLACEHOLDER_IMAGE;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={cn("relative overflow-hidden bg-secondary", className)}>
            {/* Shimmer placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/50 to-secondary animate-shimmer" />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover transition-all duration-500",
                        isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                    )}
                    onLoad={() => setIsLoaded(true)}
                    onError={(e) => {
                        // Fallback to placeholder on error
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        setIsLoaded(true);
                    }}
                />
            )}
        </div>
    );
}
