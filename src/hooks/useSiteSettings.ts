'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Category, DEFAULT_CATEGORIES } from '@/types/database';

interface SiteSettingsData {
    whatsapp_primary: string;
    whatsapp_secondary: string;
    business_name: string;
    business_address: string;
    business_email: string;
    currency_symbol: string;
    min_order_default: string;
    search_enabled: string; // 'true' or 'false' as string
    size_chart: string; // JSON string containing size measurements
    store_map_url: string; // Google Maps / Apple Maps URL for store location
    category_scrollable: string; // 'true' or 'false' - enables horizontal scroll for categories
    business_hours: string; // Display text for business hours
    store_location_name: string; // Short location name (e.g., "Karol Bagh, New Delhi")
    google_maps_embed_url: string; // Google Maps iframe embed URL
    categories: string; // JSON string containing category configuration
}

const DEFAULT_SIZE_CHART = {
    S: { chest: '36"', length: '26"', shoulder: '16"' },
    M: { chest: '38"', length: '27"', shoulder: '17"' },
    L: { chest: '40"', length: '28"', shoulder: '18"' },
    XL: { chest: '42"', length: '29"', shoulder: '19"' },
    XXL: { chest: '44"', length: '30"', shoulder: '20"' },
    XXXL: { chest: '46"', length: '31"', shoulder: '21"' },
    XXXXL: { chest: '48"', length: '32"', shoulder: '22"' },
};

const DEFAULT_SETTINGS: SiteSettingsData = {
    whatsapp_primary: '919599965931',
    whatsapp_secondary: '919582142143',
    business_name: 'Tom White',
    business_address: 'H-16/86 Gali No 4, Tank Road, Near Bhalle Wale, Karol Bagh, New Delhi - 110005',
    business_email: 'contact@tomwhite.in',
    currency_symbol: '₹',
    min_order_default: '50',
    search_enabled: 'false', // Default: search is OFF
    size_chart: JSON.stringify(DEFAULT_SIZE_CHART),
    store_map_url: 'https://maps.google.com/?q=28.6519,77.1900', // Karol Bagh, New Delhi coordinates
    category_scrollable: 'false', // Default: grid layout
    business_hours: 'Mon - Sat: 10:00 AM - 8:00 PM',
    store_location_name: 'Karol Bagh, New Delhi',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.5831093405147!2d77.18774507550176!3d28.651923775658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029e2c80a7a7%3A0x2b5e1a3aab6e4a75!2sKarol%20Bagh%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1706320000000!5m2!1sen!2sin',
    categories: JSON.stringify(DEFAULT_CATEGORIES),
};

export function useSiteSettings() {
    return useQuery({
        queryKey: ['site-settings'],
        queryFn: async (): Promise<SiteSettingsData> => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value');

            if (error) {
                console.error('Error fetching site settings:', error);
                return DEFAULT_SETTINGS;
            }

            const settings = { ...DEFAULT_SETTINGS };
            (data || []).forEach((row) => {
                if (row.key in settings) {
                    (settings as Record<string, string>)[row.key] = row.value;
                }
            });

            return settings;
        },
    });
}

export function useUpdateSiteSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: Partial<SiteSettingsData>) => {
            const updates = Object.entries(settings).map(([key, value]) => ({
                key,
                value: value || '',
            }));

            for (const update of updates) {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert(update, { onConflict: 'key' });

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
        },
    });
}

// Helper function to check if search is enabled
export function isSearchEnabled(settings: SiteSettingsData | undefined): boolean {
    return settings?.search_enabled === 'true';
}

// Helper function to check if scrollable categories is enabled
export function isCategoryScrollable(settings: SiteSettingsData | undefined): boolean {
    return settings?.category_scrollable === 'true';
}

// Helper type for size chart
export interface SizeChartEntry {
    chest: string;
    length: string;
    shoulder: string;
}

export type SizeChartData = Record<string, SizeChartEntry>;

// Export default size chart for admin UI
export { DEFAULT_SIZE_CHART };

// Helper function to parse size chart from settings
// Merges with DEFAULT_SIZE_CHART to ensure all sizes are present
export function parseSizeChart(settings: SiteSettingsData | undefined): SizeChartData {
    if (!settings?.size_chart) {
        return DEFAULT_SIZE_CHART;
    }
    try {
        const parsed = JSON.parse(settings.size_chart);
        // Merge with default to ensure all sizes exist (including XXXXL if missing)
        return { ...DEFAULT_SIZE_CHART, ...parsed };
    } catch {
        return DEFAULT_SIZE_CHART;
    }
}

// Helper function to parse categories from settings
export function parseCategories(settings: SiteSettingsData | undefined): Category[] {
    if (!settings?.categories) {
        return DEFAULT_CATEGORIES;
    }
    try {
        const parsed = JSON.parse(settings.categories) as Category[];
        // Sort by order and return
        return parsed.sort((a, b) => a.order - b.order);
    } catch {
        return DEFAULT_CATEGORIES;
    }
}

// Get only active categories sorted by order
export function getActiveCategories(settings: SiteSettingsData | undefined): Category[] {
    return parseCategories(settings).filter(cat => cat.active);
}
