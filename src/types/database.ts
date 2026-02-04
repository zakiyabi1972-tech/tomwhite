// Database types for TopWhite Catalog

// ProductCategory is now a string to support dynamic categories
export type ProductCategory = string;

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

// Category interface for dynamic category management
export interface Category {
    slug: string;         // URL-friendly identifier
    name: string;         // Display name
    description: string;  // Category description
    icon: string;         // Icon filename (e.g., 'plain.png')
    order: number;        // Display order
    active: boolean;      // Show/hide category
}

// Available icons in public/icons/ directory
export const AVAILABLE_ICONS = [
    'plain.png',
    'printed.png',
    'embossed.png',
    'embroidered.png',
    'collar.png',
    'knitted.png',
    'silicon.png',
    'patch.png',
    'downshoulder.png',
] as const;

// Default categories (used as fallback and for seeding)
export const DEFAULT_CATEGORIES: Category[] = [
    { slug: 'plain', name: 'Plain', icon: 'plain.png', description: 'Solid color T-shirts', order: 1, active: true },
    { slug: 'printed', name: 'Printed', icon: 'printed.png', description: 'Printed designs', order: 2, active: true },
    { slug: 'embossed', name: 'Embossed', icon: 'embossed.png', description: 'Embossed texture', order: 3, active: true },
    { slug: 'embroidered', name: 'Embroidered', icon: 'embroidered.png', description: 'Thread embroidery', order: 4, active: true },
    { slug: 'collar', name: 'Collar/Polo', icon: 'collar.png', description: 'Polo/collar T-shirts', order: 5, active: true },
    { slug: 'knitted', name: 'Knitted', icon: 'knitted.png', description: 'Knitted fabric', order: 6, active: true },
    { slug: 'silicon', name: 'Silicon', icon: 'silicon.png', description: 'Silicon print', order: 7, active: true },
    { slug: 'patch', name: 'Patch', icon: 'patch.png', description: 'Patch-applied designs', order: 8, active: true },
    { slug: 'downshoulder', name: 'Drop Shoulder', icon: 'downshoulder.png', description: 'Drop shoulder style', order: 9, active: true },
];

// Legacy CATEGORIES export for backward compatibility
export const CATEGORIES = DEFAULT_CATEGORIES.map(cat => ({
    id: cat.slug as ProductCategory,
    name: cat.name,
    icon: cat.icon,
    description: cat.description,
}));

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'] as const;

// Helper to sort sizes in correct order
export function sortSizes(sizes: string[]): string[] {
    return sizes.sort((a, b) => {
        const indexA = SIZES.indexOf(a as typeof SIZES[number]);
        const indexB = SIZES.indexOf(b as typeof SIZES[number]);
        // If size not found in SIZES, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
}

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
