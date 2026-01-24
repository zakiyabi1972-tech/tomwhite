'use client';

import { useMemo, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductSearch } from './ProductSearch';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useSiteSettings, isSearchEnabled } from '@/hooks/useSiteSettings';
import type { ProductWithImages } from '@/types/database';

interface ProductsSectionProps {
    products: ProductWithImages[];
    isLoading: boolean;
    onOpenDetail: (product: ProductWithImages) => void;
}

export function ProductsSection({ products, isLoading, onOpenDetail }: ProductsSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: settings } = useSiteSettings();
    const searchEnabled = isSearchEnabled(settings);

    // Only filter if search is enabled
    const filteredProducts = useProductSearch(
        products,
        searchEnabled ? searchQuery : ''
    );

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    if (isLoading) {
        return (
            <section id="products" className="py-12 sm:py-16 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="py-12 sm:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-4 mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                Our Products
                            </h2>
                            <p className="text-muted-foreground">
                                {searchEnabled && searchQuery
                                    ? `${filteredProducts.length} of ${products.length} products`
                                    : `${products.length} products available`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Only show search if enabled */}
                    {searchEnabled && (
                        <ProductSearch
                            onSearch={handleSearch}
                            className="max-w-md"
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <ProductCard product={product} onOpenDetail={onOpenDetail} />
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {searchEnabled && searchQuery
                                ? `No products found for "${searchQuery}".`
                                : 'No products found. Add products from the admin panel.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
