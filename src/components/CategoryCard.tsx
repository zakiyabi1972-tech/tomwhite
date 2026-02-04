'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
    slug: string;
    name: string;
    iconUrl: string;
    count?: number;
    isSelected: boolean;
    onClick: () => void;
    compact?: boolean; // For scrollable horizontal view
}

export function CategoryCard({ slug, name, iconUrl, count, isSelected, onClick, compact }: CategoryCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                // Compact mode: fixed width for horizontal scroll
                // Default mode: aspect-square for grid
                compact
                    ? "w-24 h-28 flex flex-col items-center justify-center gap-1"
                    : "aspect-square flex flex-col items-center justify-center gap-1",
                // Equal padding all around
                "p-2 rounded-lg sm:rounded-xl border transition-all duration-200",
                "hover:shadow-hover hover:border-accent/50 hover:-translate-y-0.5",
                isSelected
                    ? "bg-accent/10 border-accent shadow-md"
                    : "bg-card border-border shadow-card"
            )}
        >
            {/* Icon - larger size for visibility */}
            <div className={cn(
                "relative",
                compact ? "w-12 h-12" : "w-14 h-14 sm:w-[60px] sm:h-[60px]"
            )}>
                <Image
                    src={iconUrl}
                    alt={name}
                    fill
                    className="object-contain opacity-80 mix-blend-multiply dark:invert dark:mix-blend-normal"
                    sizes={compact ? "48px" : "(max-width: 640px) 56px, 60px"}
                />
            </div>

            {/* Category name */}
            <span className={cn(
                "font-medium text-center leading-tight",
                compact ? "text-[10px]" : "text-xs sm:text-sm"
            )}>
                {name}
            </span>

            {/* Product count */}
            {count !== undefined && (
                <span className={cn(
                    "text-muted-foreground",
                    compact ? "text-[9px]" : "text-[10px] sm:text-xs"
                )}>
                    {count} {count === 1 ? 'item' : 'items'}
                </span>
            )}
        </button>
    );
}
