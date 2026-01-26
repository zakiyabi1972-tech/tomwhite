'use client';

import { useState } from 'react';
import { Package, Ruler, Palette, Scale, Info, ChevronLeft, ChevronRight, Phone, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from './LazyImage';
import { cn } from '@/lib/utils';
import type { ProductWithImages } from '@/types/database';
import { formatPriceRange } from '@/types/database';
import { useSiteSettings, parseSizeChart } from '@/hooks/useSiteSettings';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

interface ProductDetailModalProps {
    product: ProductWithImages | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sizeChartOpen, setSizeChartOpen] = useState(false);
    const { data: settings } = useSiteSettings();
    const whatsappNumber = settings?.whatsapp_primary || '919599965931';
    const sizeChart = parseSizeChart(settings);

    if (!product) return null;

    // Filter out empty URLs and ensure we always have at least the placeholder
    const validImages = product.images
        .map(img => img.image_url)
        .filter(url => url && url.trim() !== '');
    const imageUrls = validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE];

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? imageUrls.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    function getProductWhatsAppLink(): string {
        const priceRange = formatPriceRange(product!.price_min, product!.price_max);
        const message = encodeURIComponent(
            `Hi, I'm interested in:\n\n` +
            `📦 *${product!.article_name}*\n` +
            `📋 Category: ${product!.category}\n` +
            `🏷️ Price: ${priceRange}\n` +
            `📊 GSM: ${product!.gsm}\n` +
            `🧵 Fabric: ${product!.fabric_name}\n` +
            `📐 Sizes: ${product!.sizes.join(', ')}\n` +
            `🎨 Colors: ${product!.colors.join(', ')}\n` +
            `📦 Min Order: ${product!.min_order} pcs\n\n` +
            `Please share more details.`
        );
        return `https://wa.me/${whatsappNumber}?text=${message}`;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
                setCurrentImageIndex(0);
            }
        }}>
            {/* Mobile: full width with small margin, Desktop: max-w-3xl */}
            <DialogContent className="w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="font-display text-lg sm:text-xl pr-8">{product.article_name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Image Gallery */}
                    <div className="space-y-2 sm:space-y-3">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                            <LazyImage
                                src={imageUrls[currentImageIndex]}
                                alt={product.article_name}
                                className="w-full h-full"
                            />
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                                {product.tag === 'new' && (
                                    <Badge className="bg-accent text-accent-foreground text-xs">New</Badge>
                                )}
                                {product.tag === 'bestseller' && (
                                    <Badge className="bg-primary text-primary-foreground text-xs">Bestseller</Badge>
                                )}
                                {product.tag === 'hot' && (
                                    <Badge className="bg-destructive text-destructive-foreground text-xs">Hot</Badge>
                                )}
                            </div>

                            {/* Navigation Arrows */}
                            {imageUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {imageUrls.length > 1 && (
                            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1">
                                {imageUrls.map((image, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={cn(
                                            "relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                                            idx === currentImageIndex
                                                ? 'border-accent ring-2 ring-accent/30'
                                                : 'border-border hover:border-accent/50'
                                        )}
                                    >
                                        <LazyImage
                                            src={image}
                                            alt={`${product.article_name} - view ${idx + 1}`}
                                            className="w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Description */}
                        {product.description && (
                            <div>
                                <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1 sm:mb-2 flex items-center gap-2">
                                    <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Description
                                </h4>
                                <p className="text-sm sm:text-base text-foreground">{product.description}</p>
                            </div>
                        )}

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div className="bg-secondary/50 rounded-lg p-2 sm:p-3">
                                <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-[10px] sm:text-xs uppercase mb-0.5 sm:mb-1">
                                    <Scale className="h-3 w-3" />
                                    GSM
                                </div>
                                <div className="font-semibold text-sm sm:text-base">{product.gsm} GSM</div>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-2 sm:p-3">
                                <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-[10px] sm:text-xs uppercase mb-0.5 sm:mb-1">
                                    <Package className="h-3 w-3" />
                                    Fabric
                                </div>
                                <div className="font-semibold text-sm sm:text-base">{product.fabric_name}</div>
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1 sm:mb-2 flex items-center gap-2">
                                    <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Available Colors
                                </h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {product.colors.map((color) => (
                                        <Badge key={color} variant="outline" className="text-xs sm:text-sm">
                                            {color}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price & Min Order */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">Price Range</div>
                                    <div className="font-display font-bold text-xl sm:text-2xl text-primary">
                                        {formatPriceRange(product.price_min, product.price_max)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs sm:text-sm text-muted-foreground">Min. Order</div>
                                    <div className="font-display font-bold text-base sm:text-lg">{product.min_order} pcs</div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Button */}
                        <Button
                            asChild
                            size="lg"
                            className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground text-sm sm:text-base h-10 sm:h-11"
                        >
                            <a
                                href={getProductWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Inquire on WhatsApp
                            </a>
                        </Button>

                        {/* Call Now Button */}
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary/10 text-sm sm:text-base h-10 sm:h-11"
                        >
                            <a href={`tel:+${whatsappNumber}`}>
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Call Now
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Size Chart - Collapsible */}
                <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
                    <button
                        type="button"
                        onClick={() => setSizeChartOpen(!sizeChartOpen)}
                        className="w-full font-semibold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-between gap-2 hover:text-foreground transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <Ruler className="h-3 w-3 sm:h-4 sm:w-4" />
                            Size Chart
                        </span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", sizeChartOpen && "rotate-180")} />
                    </button>
                    <div className={cn("overflow-hidden transition-all duration-300", sizeChartOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                        {/* Scrollable table wrapper for mobile */}
                        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                            <table className="w-full text-xs sm:text-sm min-w-[320px]">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-2 sm:px-3 font-semibold">Size</th>
                                        <th className="text-center py-2 px-2 sm:px-3 font-semibold">Chest</th>
                                        <th className="text-center py-2 px-2 sm:px-3 font-semibold">Length</th>
                                        <th className="text-center py-2 px-2 sm:px-3 font-semibold">Shoulder</th>
                                        <th className="text-center py-2 px-2 sm:px-3 font-semibold">Avail.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(sizeChart).map(([size, measurements]) => {
                                        const isAvailable = product.sizes.includes(size);
                                        return (
                                            <tr key={size} className={cn("border-b", !isAvailable && "opacity-40")}>
                                                <td className="py-2 px-2 sm:px-3 font-medium">{size}</td>
                                                <td className="text-center py-2 px-2 sm:px-3">{measurements.chest}</td>
                                                <td className="text-center py-2 px-2 sm:px-3">{measurements.length}</td>
                                                <td className="text-center py-2 px-2 sm:px-3">{measurements.shoulder}</td>
                                                <td className="text-center py-2 px-2 sm:px-3">
                                                    {isAvailable ? (
                                                        <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px] sm:text-xs">✓</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

