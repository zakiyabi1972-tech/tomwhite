'use client';

import { useState } from 'react';
import { Ruler, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from './LazyImage';
import type { ProductWithImages } from '@/types/database';
import { formatPriceRange } from '@/types/database';
import { useSiteSettings } from '@/hooks/useSiteSettings';

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = '/placeholder.svg';

interface ProductCardProps {
    product: ProductWithImages;
    onOpenDetail: (product: ProductWithImages) => void;
}

export function ProductCard({ product, onOpenDetail }: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { data: settings } = useSiteSettings();
    const whatsappNumber = settings?.whatsapp_primary || '919599965931';

    // Get image URLs or use placeholder - ensure no empty strings
    const imageUrls = product.images && product.images.length > 0
        ? product.images
            .map(img => img.image_url)
            .filter(url => url && url.trim() !== '')
        : [PLACEHOLDER_IMAGE];

    // If all URLs were empty, use placeholder
    const safeImageUrls = imageUrls.length > 0 ? imageUrls : [PLACEHOLDER_IMAGE];

    function getProductWhatsAppLink(): string {
        const priceRange = formatPriceRange(product.price_min, product.price_max);
        const message = encodeURIComponent(
            `Hi, I'm interested in this product:\n\n` +
            `*${product.article_name}*\n` +
            `----------------------------------\n` +
            `Category: ${product.category}\n` +
            `Price: ${priceRange}\n` +
            `GSM: ${product.gsm}\n\n` +
            `Please share more details.`
        );
        return `https://wa.me/${whatsappNumber}?text=${message}`;
    }

    return (
        <div
            className="group bg-card rounded-xl border border-border shadow-card overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 cursor-pointer h-full flex flex-col"
            onClick={() => onOpenDetail(product)}
        >
            {/* Image */}
            <div className="relative aspect-square bg-secondary overflow-hidden">
                <LazyImage
                    src={safeImageUrls[currentImageIndex] || PLACEHOLDER_IMAGE}
                    alt={product.article_name}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                    {product.tag === 'new' && (
                        <Badge className="bg-accent text-accent-foreground text-[10px] sm:text-xs px-1.5 sm:px-2">New</Badge>
                    )}
                    {product.tag === 'bestseller' && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2">Bestseller</Badge>
                    )}
                    {product.tag === 'hot' && (
                        <Badge className="bg-destructive text-destructive-foreground text-[10px] sm:text-xs px-1.5 sm:px-2">Hot</Badge>
                    )}
                </div>

                {/* GSM Badge */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <Badge variant="secondary" className="font-mono text-[10px] sm:text-xs px-1.5 sm:px-2">
                        {product.gsm} GSM
                    </Badge>
                </div>

                {/* Image Thumbnails */}
                {safeImageUrls.length > 1 && (
                    <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
                        {safeImageUrls.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                }}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${idx === currentImageIndex
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/75'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-2 sm:p-4 flex-1 flex flex-col">
                {/* Product Name - Single line with truncate */}
                <h3 className="font-display font-semibold text-[13px] sm:text-base mb-0.5 sm:mb-2 truncate leading-tight">
                    {product.article_name}
                </h3>

                {/* Specs - Sizes and Colors */}
                <div className="space-y-0.5 sm:space-y-2 mb-1.5 sm:mb-4 flex-1">
                    <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
                        <Ruler className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                        <span className="truncate">{product.sizes.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
                        <Palette className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                        <span className="truncate">
                            {product.colors && product.colors.length > 0
                                ? (product.colors.slice(0, 3).join(', ') + (product.colors.length > 3 ? '...' : ''))
                                : 'All Colors'}
                        </span>
                    </div>
                </div>

                {/* Price and Min Order */}
                <div className="flex items-center justify-between mb-1.5 sm:mb-4">
                    <div>
                        <div className="font-display font-bold text-sm sm:text-lg text-foreground">
                            {formatPriceRange(product.price_min, product.price_max)}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                            Min. {product.min_order} pcs
                        </div>
                    </div>
                </div>

                {/* WhatsApp Button */}
                <Button
                    asChild
                    className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground text-[11px] sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <a
                        href={getProductWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="truncate">Inquire on WhatsApp</span>
                    </a>
                </Button>
            </div>
        </div>
    );
}
