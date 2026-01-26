'use client';

import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types/database';

interface IconProps {
    className?: string;
}

// Plain T-Shirt - Simple basic t-shirt outline
function PlainTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Neckline */}
            <path d="M24 12 C24 12 28 16 32 16 C36 16 40 12 40 12" />
            {/* Collar curve */}
            <ellipse cx="32" cy="12" rx="8" ry="3" />
            {/* Left sleeve */}
            <path d="M24 12 L12 20 L12 28 L20 26 L20 52" />
            {/* Right sleeve */}
            <path d="M40 12 L52 20 L52 28 L44 26 L44 52" />
            {/* Body */}
            <path d="M20 52 L44 52" />
            <path d="M20 26 L20 52" />
            <path d="M44 26 L44 52" />
            {/* Shoulder lines */}
            <path d="M24 12 L20 26" />
            <path d="M40 12 L44 26" />
        </svg>
    );
}

// Printed T-Shirt - T-shirt with star and wavy pattern
function PrintedTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Base T-shirt shape */}
            <ellipse cx="32" cy="12" rx="8" ry="3" />
            <path d="M24 12 L12 20 L12 28 L20 26 L20 52 L44 52 L44 26 L52 28 L52 20 L40 12" />
            <path d="M24 12 L20 26" />
            <path d="M40 12 L44 26" />
            {/* Star design on chest */}
            <path d="M32 24 L33.5 29 L38.5 29 L34.5 32 L36 37 L32 34 L28 37 L29.5 32 L25.5 29 L30.5 29 Z" />
            {/* Wavy pattern lines */}
            <path d="M24 40 Q28 38 32 40 Q36 42 40 40" />
            <path d="M24 45 Q28 43 32 45 Q36 47 40 45" />
        </svg>
    );
}

// Embossed T-Shirt - T-shirt with 3D text effect
function EmbossedTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Base T-shirt shape */}
            <ellipse cx="32" cy="12" rx="8" ry="3" />
            <path d="M24 12 L12 20 L12 28 L20 26 L20 52 L44 52 L44 26 L52 28 L52 20 L40 12" />
            <path d="M24 12 L20 26" />
            <path d="M40 12 L44 26" />
            {/* 3D text */}
            <text x="25" y="34" fontSize="12" fontWeight="bold" fill="none" stroke="currentColor" strokeWidth="1.2">3D</text>
            {/* Underline effects */}
            <line x1="25" y1="38" x2="40" y2="38" />
            <line x1="27" y1="42" x2="38" y2="42" />
        </svg>
    );
}

// Embroidered T-Shirt - T-shirt with needle and cross-stitch pattern
function EmbroideredTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Base T-shirt shape */}
            <ellipse cx="32" cy="12" rx="8" ry="3" />
            <path d="M24 12 L12 20 L12 28 L20 26 L20 52 L44 52 L44 26 L52 28 L52 20 L40 12" />
            <path d="M24 12 L20 26" />
            <path d="M40 12 L44 26" />
            {/* Cross-stitch pattern (X marks) */}
            <path d="M24 36 L28 40 M28 36 L24 40" />
            <path d="M30 36 L34 40 M34 36 L30 40" />
            <path d="M36 36 L40 40 M40 36 L36 40" />
            <path d="M27 42 L31 46 M31 42 L27 46" />
            <path d="M33 42 L37 46 M37 42 L33 46" />
            {/* Needle with thread */}
            <path d="M44 22 L50 16" strokeWidth="2" />
            <circle cx="51" cy="15" r="1" strokeWidth="0.5" />
            <path d="M44 22 Q42 28 38 32" strokeDasharray="2 2" />
        </svg>
    );
}

// Polo/Collar T-Shirt - Shirt with collar and buttons
function CollarTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Collar shape */}
            <path d="M24 14 L28 8 L32 14 L36 8 L40 14" />
            <path d="M28 8 L32 12 L36 8" />
            {/* Collar sides */}
            <path d="M24 14 L26 20" />
            <path d="M40 14 L38 20" />
            {/* Left sleeve */}
            <path d="M24 14 L12 22 L12 30 L20 28 L20 54" />
            {/* Right sleeve */}
            <path d="M40 14 L52 22 L52 30 L44 28 L44 54" />
            {/* Body */}
            <path d="M20 54 L44 54" />
            <path d="M20 28 L20 54" />
            <path d="M44 28 L44 54" />
            <path d="M26 20 L20 28" />
            <path d="M38 20 L44 28" />
            {/* Button placket */}
            <line x1="32" y1="14" x2="32" y2="36" />
            <circle cx="32" cy="20" r="1.5" />
            <circle cx="32" cy="28" r="1.5" />
        </svg>
    );
}

// Knitted Sweater - Cable knit pattern sweater
function KnittedTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Ribbed neckline */}
            <ellipse cx="32" cy="10" rx="10" ry="4" />
            <path d="M24 12 Q28 16 32 12 Q36 8 40 12" strokeWidth="1" />
            {/* Long sleeves */}
            <path d="M22 10 L8 18 L8 26 L16 24 L16 54" />
            <path d="M42 10 L56 18 L56 26 L48 24 L48 54" />
            {/* Body */}
            <path d="M16 54 L48 54" />
            <path d="M22 10 L16 24" />
            <path d="M42 10 L48 24" />
            {/* Cable knit pattern - braided vertical lines */}
            <path d="M26 20 Q24 28 28 32 Q32 36 28 44 Q24 48 28 52" />
            <path d="M32 20 Q34 28 30 32 Q26 36 30 44 Q34 48 30 52" />
            <path d="M38 20 Q36 28 40 32 Q44 36 40 44 Q36 48 40 52" />
            {/* Sleeve cuffs */}
            <path d="M8 24 L8 26" strokeWidth="2" />
            <path d="M56 24 L56 26" strokeWidth="2" />
            {/* Bottom ribbing */}
            <path d="M16 52 L48 52" />
        </svg>
    );
}

// Silicon Print T-Shirt - T-shirt with organic blob/droplet shapes
function SiliconTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Base T-shirt shape */}
            <ellipse cx="32" cy="12" rx="8" ry="3" />
            <path d="M24 12 L12 20 L12 28 L20 26 L20 52 L44 52 L44 26 L52 28 L52 20 L40 12" />
            <path d="M24 12 L20 26" />
            <path d="M40 12 L44 26" />
            {/* Organic blob shapes (silicon print effect) */}
            <path d="M26 26 Q22 30 26 34 Q30 38 26 42 Q22 44 28 46" strokeWidth="2" />
            <ellipse cx="35" cy="32" rx="5" ry="4" />
            <circle cx="30" cy="38" r="3" />
            <ellipse cx="38" cy="44" rx="4" ry="3" />
            {/* Small dots for texture */}
            <circle cx="24" cy="48" r="1.5" />
            <circle cx="40" cy="36" r="1.5" />
        </svg>
    );
}

// Patch T-Shirt - T-shirt with pocket and badge
function PatchTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Base T-shirt shape */}
            <ellipse cx="32" cy="12" rx="8" ry="3" />
            <path d="M24 12 L12 20 L12 28 L20 26 L20 52 L44 52 L44 26 L52 28 L52 20 L40 12" />
            <path d="M24 12 L20 26" />
            <path d="M40 12 L44 26" />
            {/* Pocket with patch/badge */}
            <rect x="26" y="30" width="12" height="10" rx="1" />
            {/* Badge design inside pocket */}
            <path d="M29 33 L32 35 L35 33 L35 37 L32 39 L29 37 Z" />
            {/* Stitching lines on pocket */}
            <path d="M27 31 L37 31" strokeDasharray="1.5 1" />
            <path d="M27 39 L37 39" strokeDasharray="1.5 1" />
        </svg>
    );
}

// Drop Shoulder T-Shirt - Oversized relaxed fit with dropped shoulders
function DropShoulderTShirtIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("w-10 h-10", className)}>
            {/* Wide neckline */}
            <ellipse cx="32" cy="12" rx="10" ry="3" />
            {/* Dropped/extended shoulders and sleeves */}
            <path d="M22 12 L6 22 L6 28" />
            <path d="M42 12 L58 22 L58 28" />
            {/* Dropped sleeve connection */}
            <path d="M6 28 L18 26" />
            <path d="M58 28 L46 26" />
            {/* Wide body */}
            <path d="M18 26 L18 54" />
            <path d="M46 26 L46 54" />
            <path d="M18 54 L46 54" />
            {/* Shoulder drop lines */}
            <path d="M22 12 L18 26" />
            <path d="M42 12 L46 26" />
        </svg>
    );
}

// Map category ID to icon component
const CATEGORY_ICONS: Record<ProductCategory, React.FC<IconProps>> = {
    plain: PlainTShirtIcon,
    printed: PrintedTShirtIcon,
    embossed: EmbossedTShirtIcon,
    embroidered: EmbroideredTShirtIcon,
    collar: CollarTShirtIcon,
    knitted: KnittedTShirtIcon,
    silicon: SiliconTShirtIcon,
    patch: PatchTShirtIcon,
    downshoulder: DropShoulderTShirtIcon,
};

interface CategoryIconProps {
    category: ProductCategory;
    className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
    const IconComponent = CATEGORY_ICONS[category];
    if (!IconComponent) {
        return <PlainTShirtIcon className={className} />;
    }
    return <IconComponent className={className} />;
}

// Export individual icons for direct use if needed
export {
    PlainTShirtIcon,
    PrintedTShirtIcon,
    EmbossedTShirtIcon,
    EmbroideredTShirtIcon,
    CollarTShirtIcon,
    KnittedTShirtIcon,
    SiliconTShirtIcon,
    PatchTShirtIcon,
    DropShoulderTShirtIcon,
};
