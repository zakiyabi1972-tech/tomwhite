'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SiteSettingsData {
    whatsapp_primary: string;
    whatsapp_secondary: string;
    business_name: string;
    business_address: string;
    business_email: string;
    currency_symbol: string;
    min_order_default: string;
    search_enabled: string; // 'true' or 'false' as string
}

const DEFAULT_SETTINGS: SiteSettingsData = {
    whatsapp_primary: '919599965931',
    whatsapp_secondary: '919582142143',
    business_name: 'Tom White',
    business_address: 'H-16/86 Gali No 4, Tank Road, Near Bhalle Wale, Karol Bagh, New Delhi - 110005',
    business_email: '',
    currency_symbol: '₹',
    min_order_default: '50',
    search_enabled: 'false', // Default: search is OFF
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
