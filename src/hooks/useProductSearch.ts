import { useMemo } from 'react';
import type { ProductWithImages } from '@/types/database';

export function useProductSearch(products: ProductWithImages[], query: string): ProductWithImages[] {
    return useMemo(() => {
        if (!query.trim()) return products;

        const searchTerm = query.toLowerCase().trim();

        return products.filter((product) => {
            // Search in article name
            if (product.article_name.toLowerCase().includes(searchTerm)) return true;

            // Search in fabric name
            if (product.fabric_name.toLowerCase().includes(searchTerm)) return true;

            // Search in category
            if (product.category.toLowerCase().includes(searchTerm)) return true;

            // Search in colors
            if (product.colors.some(color => color.toLowerCase().includes(searchTerm))) return true;

            // Search in description
            if (product.description?.toLowerCase().includes(searchTerm)) return true;

            return false;
        });
    }, [products, query]);
}
