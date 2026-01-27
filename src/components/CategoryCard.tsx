'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types/database';

// Map category to image path
const CATEGORY_ICONS: Record<ProductCategory, string> = {
    plain: '/icons/plain.png',
    printed: '/icons/printed.png',
    embossed: '/icons/embossed.png',
    embroidered: '/icons/embroidered.png',
    collar: '/icons/collar.png',
    knitted: '/icons/knitted.png',
    silicon: '/icons/silicon.png',
    patch: '/icons/patch.png',
    downshoulder: '/icons/downshoulder.png',
};

interface CategoryCardProps {
    category: ProductCategory;
    name: string;
    count?: number;
    isSelected: boolean;
    onClick: () => void;
    compact?: boolean; // For scrollable horizontal view
}

export function CategoryCard({ category, name, count, isSelected, onClick, compact }: CategoryCardProps) {
    const iconPath = CATEGORY_ICONS[category] || '/icons/plain.png';

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
                    src={iconPath}
                    alt={name}
                    fill
                    className="object-contain opacity-80 mix-blend-multiply dark:invert dark:mix-blend-normal"
                    sizes={compact ? "48px" : "(max-width: 640px) 56px, 60px"}
                />
            </div>
            {/* Text - compact */}
            <div className="text-center">
                <h3 className={cn(
                    "font-display font-semibold leading-tight",
                    compact ? "text-xs" : "text-[13px] sm:text-sm"
                )}>
                    {name}
                </h3>
                {count !== undefined && count > 0 && (
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
                        {count} items
                    </p>
                )}
            </div>
        </button>
    );
}



