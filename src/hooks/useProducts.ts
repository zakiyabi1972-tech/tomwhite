'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ProductWithImages, ProductCategory } from '@/types/database';

// Fetch all products with images
export function useProducts(category?: ProductCategory | null) {
    return useQuery({
        queryKey: ['products', category],
        queryFn: async (): Promise<ProductWithImages[]> => {
            let query = supabase
                .from('products')
                .select(`
          *,
          images:product_images(*)
        `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products:', error);
                throw error;
            }

            return (data || []) as ProductWithImages[];
        },
    });
}

// Fetch all products for admin (including inactive)
export function useAdminProducts() {
    return useQuery({
        queryKey: ['admin-products'],
        queryFn: async (): Promise<ProductWithImages[]> => {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          images:product_images(*)
        `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching admin products:', error);
                throw error;
            }

            return (data || []) as ProductWithImages[];
        },
    });
}

// Fetch single product
export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async (): Promise<ProductWithImages | null> => {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          images:product_images(*)
        `)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
                throw error;
            }

            return data as ProductWithImages;
        },
        enabled: !!id,
    });
}

// Delete product
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            // First delete images from storage
            const { data: images } = await supabase
                .from('product_images')
                .select('image_url')
                .eq('product_id', id);

            if (images) {
                for (const img of images) {
                    const path = img.image_url.split('/product-images/')[1];
                    if (path) {
                        await supabase.storage.from('product-images').remove([path]);
                    }
                }
            }

            // Delete product (images will cascade)
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
    });
}

// Toggle product active status
export function useToggleProductActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const { error } = await supabase
                .from('products')
                .update({ is_active: isActive })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
    });
}

// Get product counts by category
export function useCategoryCounts() {
    return useQuery({
        queryKey: ['category-counts'],
        queryFn: async (): Promise<Record<string, number>> => {
            const { data, error } = await supabase
                .from('products')
                .select('category')
                .eq('is_active', true);

            if (error) {
                console.error('Error fetching category counts:', error);
                throw error;
            }

            const counts: Record<string, number> = {};
            (data || []).forEach((product) => {
                counts[product.category] = (counts[product.category] || 0) + 1;
            });

            return counts;
        },
    });
}
