// Database types for TopWhite Catalog

export type ProductCategory =
    | 'plain'
    | 'printed'
    | 'embossed'
    | 'embroidered'
    | 'collar'
    | 'knitted'
    | 'silicon'
    | 'patch'
    | 'downshoulder';

export type ProductTag = 'new' | 'hot' | 'bestseller';

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    display_order: number;
    created_at: string | null;
}

export interface Product {
    id: string;
    article_name: string;
    fabric_name: string;
    gsm: number;
    sizes: string[];
    colors: string[];
    price_min: number;
    price_max: number | null;
    min_order: number;
    description: string | null;
    category: ProductCategory;
    tag: ProductTag | null;
    is_active: boolean | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface ProductWithImages extends Product {
    images: ProductImage[];
}

export interface SiteSettings {
    key: string;
    value: string;
    updated_at: string | null;
}

export interface UserRole {
    id: string;
    user_id: string;
    role: 'admin';
    created_at: string | null;
}

// Category metadata for display
export const CATEGORIES: { id: ProductCategory; name: string; icon: string; description: string }[] = [
    { id: 'plain', name: 'Plain', icon: '◼', description: 'Solid color T-shirts' },
    { id: 'printed', name: 'Printed', icon: '🎨', description: 'Printed designs' },
    { id: 'embossed', name: 'Embossed', icon: '✦', description: 'Embossed texture' },
    { id: 'embroidered', name: 'Embroidered', icon: '🧵', description: 'Thread embroidery' },
    { id: 'collar', name: 'Collar', icon: '👔', description: 'Polo/collar T-shirts' },
    { id: 'knitted', name: 'Knitted', icon: '🧶', description: 'Knitted fabric' },
    { id: 'silicon', name: 'Silicon', icon: '💧', description: 'Silicon print' },
    { id: 'patch', name: 'Patch', icon: '🏷', description: 'Patch-applied designs' },
    { id: 'downshoulder', name: 'Drop Shoulder', icon: '👕', description: 'Drop shoulder style' },
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const TAGS: { value: ProductTag; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'hot', label: 'Hot' },
    { value: 'bestseller', label: 'Bestseller' },
];

// Helper to format price range
export function formatPriceRange(priceMin: number, priceMax: number | null, symbol = '₹'): string {
    if (priceMax && priceMax !== priceMin) {
        return `${symbol}${priceMin} - ${symbol}${priceMax}`;
    }
    return `${symbol}${priceMin}`;
}

// Database type for Supabase client
export interface Database {
    public: {
        Tables: {
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
            };
            product_images: {
                Row: ProductImage;
                Insert: Omit<ProductImage, 'id' | 'created_at'>;
                Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>;
            };
            site_settings: {
                Row: SiteSettings;
                Insert: Omit<SiteSettings, 'updated_at'>;
                Update: Partial<Omit<SiteSettings, 'updated_at'>>;
            };
            user_roles: {
                Row: UserRole;
                Insert: Omit<UserRole, 'id' | 'created_at'>;
                Update: Partial<Omit<UserRole, 'id' | 'created_at'>>;
            };
        };
        Views: Record<string, never>;
        Functions: {
            has_role: {
                Args: { _role: string; _user_id: string };
                Returns: boolean;
            };
        };
        Enums: {
            product_category: ProductCategory;
            product_tag: ProductTag;
            app_role: 'admin';
        };
    };
}
