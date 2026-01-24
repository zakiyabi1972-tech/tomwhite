// Product seeding script for TopWhite Catalog
// Run with: node scripts/seed-products.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znbrsgvyfgohbaecxjux.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.log('Please set it with: $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Path to old project's images
const OLD_IMAGES_PATH = 'c:/Users/Rahil/Desktop/test/topwhite/project-complete-main/src/assets/products';

// Product definitions (from old project's data.ts)
const products = [
    // ========== PLAIN ARTICLES ==========
    {
        article_name: 'Premium Cotton Basic Tee',
        category: 'plain',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy', 'Grey', 'Maroon'],
        price_min: 120,
        price_max: 150,
        min_order: 50,
        description: 'Classic round neck T-shirt with premium cotton fabric. Perfect for everyday wear and bulk orders.',
        tag: 'bestseller',
        images: ['plain-black.jpg', 'plain-white.jpg'],
    },
    {
        article_name: 'Heavyweight Solid Tee',
        category: 'plain',
        gsm: 220,
        fabric_name: '100% Combed Cotton',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Charcoal', 'Olive'],
        price_min: 140,
        price_max: 170,
        min_order: 50,
        description: 'Heavy-duty cotton T-shirt for premium quality requirements.',
        tag: null,
        images: ['plain-navy.jpg', 'plain-olive.jpg'],
    },
    {
        article_name: 'Soft Touch Basic',
        category: 'plain',
        gsm: 160,
        fabric_name: 'Cotton Blend',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['All Colors Available'],
        price_min: 100,
        price_max: 130,
        min_order: 100,
        description: 'Soft and comfortable everyday T-shirt at competitive pricing.',
        tag: 'new',
        images: ['plain-grey.jpg', 'plain-maroon.jpg'],
    },
    {
        article_name: 'Ultra Comfort Tee',
        category: 'plain',
        gsm: 200,
        fabric_name: 'Ring Spun Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Olive', 'Maroon'],
        price_min: 130,
        price_max: 160,
        min_order: 50,
        description: 'Premium ring spun cotton for ultimate comfort and durability.',
        tag: null,
        images: ['plain-tshirt.jpg', 'plain-black.jpg'],
    },
    {
        article_name: 'Classic Crew Neck',
        category: 'plain',
        gsm: 170,
        fabric_name: '100% Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['White', 'Grey', 'Black'],
        price_min: 110,
        price_max: 140,
        min_order: 75,
        description: 'Traditional crew neck design with superior stitching quality.',
        tag: 'bestseller',
        images: ['plain-white.jpg', 'plain-grey.jpg'],
    },

    // ========== PRINT ARTICLES ==========
    {
        article_name: 'Digital Print Premium',
        category: 'printed',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Light Grey', 'Cream'],
        price_min: 180,
        price_max: 220,
        min_order: 50,
        description: 'High-quality digital print on premium cotton base.',
        tag: 'bestseller',
        images: ['print-white.jpg', 'print-black.jpg'],
    },
    {
        article_name: 'Screen Print Classic',
        category: 'printed',
        gsm: 160,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Maroon'],
        price_min: 150,
        price_max: 180,
        min_order: 100,
        description: 'Traditional screen printing with vibrant colors.',
        tag: null,
        images: ['print-black.jpg', 'print-navy.jpg'],
    },
    {
        article_name: 'Abstract Art Print',
        category: 'printed',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White'],
        price_min: 190,
        price_max: 230,
        min_order: 50,
        description: 'Bold abstract designs for fashion-forward customers.',
        tag: 'new',
        images: ['print-black.jpg', 'print-tshirt.jpg'],
    },
    {
        article_name: 'Vintage Logo Print',
        category: 'printed',
        gsm: 170,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Cream', 'Grey'],
        price_min: 170,
        price_max: 200,
        min_order: 75,
        description: 'Retro-inspired vintage logo prints for timeless appeal.',
        tag: null,
        images: ['print-white.jpg', 'print-navy.jpg'],
    },
    {
        article_name: 'Geometric Pattern Tee',
        category: 'printed',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'White'],
        price_min: 185,
        price_max: 215,
        min_order: 50,
        description: 'Modern geometric patterns with precise printing.',
        tag: 'bestseller',
        images: ['print-navy.jpg', 'print-black.jpg'],
    },

    // ========== EMBOSS ARTICLES ==========
    {
        article_name: '3D Emboss Premium',
        category: 'embossed',
        gsm: 200,
        fabric_name: '100% Cotton',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy'],
        price_min: 200,
        price_max: 250,
        min_order: 50,
        description: 'Raised 3D texture effect on premium fabric.',
        tag: 'new',
        images: ['emboss-black.jpg', 'emboss-white.jpg'],
    },
    {
        article_name: 'Subtle Texture Tee',
        category: 'embossed',
        gsm: 180,
        fabric_name: 'Cotton Blend',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Grey', 'Black'],
        price_min: 180,
        price_max: 220,
        min_order: 75,
        description: 'Elegant subtle embossed patterns for refined look.',
        tag: null,
        images: ['emboss-white.jpg', 'emboss-tshirt.jpg'],
    },
    {
        article_name: 'Bold Emboss Design',
        category: 'embossed',
        gsm: 220,
        fabric_name: '100% Combed Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        price_min: 220,
        price_max: 270,
        min_order: 50,
        description: 'Statement-making bold embossed graphics.',
        tag: 'bestseller',
        images: ['emboss-black.jpg', 'emboss-tshirt.jpg'],
    },
    {
        article_name: 'Logo Emboss Tee',
        category: 'embossed',
        gsm: 190,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Grey'],
        price_min: 190,
        price_max: 240,
        min_order: 50,
        description: 'Custom logo embossing available for brand identity.',
        tag: null,
        images: ['emboss-tshirt.jpg', 'emboss-black.jpg'],
    },
    {
        article_name: 'Premium Raised Pattern',
        category: 'embossed',
        gsm: 200,
        fabric_name: 'Ring Spun Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'White'],
        price_min: 210,
        price_max: 260,
        min_order: 30,
        description: 'Intricate raised patterns for luxury appeal.',
        tag: 'new',
        images: ['emboss-white.jpg', 'emboss-black.jpg'],
    },

    // ========== EMBROIDERY ARTICLES ==========
    {
        article_name: 'Classic Embroidered Tee',
        category: 'embroidered',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy', 'Olive'],
        price_min: 220,
        price_max: 280,
        min_order: 30,
        description: 'Thread embroidered designs for a premium look.',
        tag: 'bestseller',
        images: ['embroidery-white.jpg', 'embroidery-black.jpg'],
    },
    {
        article_name: 'Gold Thread Embroidery',
        category: 'embroidered',
        gsm: 200,
        fabric_name: '100% Combed Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'Maroon'],
        price_min: 280,
        price_max: 350,
        min_order: 30,
        description: 'Luxurious gold thread embroidery for premium collections.',
        tag: 'new',
        images: ['embroidery-navy.jpg', 'embroidery-black.jpg'],
    },
    {
        article_name: 'Floral Embroidered Tee',
        category: 'embroidered',
        gsm: 180,
        fabric_name: 'Cotton Blend',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Cream', 'Pink'],
        price_min: 250,
        price_max: 300,
        min_order: 50,
        description: 'Beautiful floral embroidery patterns.',
        tag: null,
        images: ['embroidery-white.jpg', 'embroidery-tshirt.jpg'],
    },
    {
        article_name: 'Minimalist Logo Embroidery',
        category: 'embroidered',
        gsm: 170,
        fabric_name: '100% Cotton',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Grey'],
        price_min: 200,
        price_max: 250,
        min_order: 50,
        description: 'Small chest logo embroidery for understated elegance.',
        tag: 'bestseller',
        images: ['embroidery-black.jpg', 'embroidery-navy.jpg'],
    },
    {
        article_name: 'Multi-Color Embroidery',
        category: 'embroidered',
        gsm: 190,
        fabric_name: 'Premium Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        price_min: 270,
        price_max: 330,
        min_order: 30,
        description: 'Vibrant multi-colored thread embroidery work.',
        tag: null,
        images: ['embroidery-tshirt.jpg', 'embroidery-white.jpg'],
    },

    // ========== COLLAR ARTICLES ==========
    {
        article_name: 'Classic Polo Shirt',
        category: 'collar',
        gsm: 220,
        fabric_name: 'Pique Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Navy', 'Red', 'Green'],
        price_min: 250,
        price_max: 320,
        min_order: 50,
        description: 'Traditional polo with ribbed collar and cuffs.',
        tag: 'bestseller',
        images: ['collar-black.jpg', 'collar-white.jpg'],
    },
    {
        article_name: 'Tipping Collar Polo',
        category: 'collar',
        gsm: 200,
        fabric_name: 'Cotton Pique',
        sizes: ['M', 'L', 'XL'],
        colors: ['Navy/White', 'Black/Red', 'White/Navy'],
        price_min: 280,
        price_max: 350,
        min_order: 30,
        description: 'Contrast tipping on collar and cuffs.',
        tag: null,
        images: ['collar-navy.jpg', 'collar-black.jpg'],
    },
    {
        article_name: 'Premium Sport Polo',
        category: 'collar',
        gsm: 180,
        fabric_name: 'Dry-Fit Cotton Blend',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Red', 'Navy', 'Black'],
        price_min: 300,
        price_max: 380,
        min_order: 50,
        description: 'Moisture-wicking polo for active lifestyle.',
        tag: 'new',
        images: ['collar-red.jpg', 'collar-white.jpg'],
    },
    {
        article_name: 'Mandarin Collar Tee',
        category: 'collar',
        gsm: 190,
        fabric_name: '100% Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'White', 'Navy'],
        price_min: 270,
        price_max: 330,
        min_order: 50,
        description: 'Modern mandarin collar for contemporary style.',
        tag: null,
        images: ['collar-tshirt.jpg', 'collar-black.jpg'],
    },
    {
        article_name: 'Executive Polo',
        category: 'collar',
        gsm: 240,
        fabric_name: 'Premium Pique',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'White'],
        price_min: 320,
        price_max: 400,
        min_order: 30,
        description: 'Premium polo for corporate and executive wear.',
        tag: 'bestseller',
        images: ['collar-navy.jpg', 'collar-red.jpg'],
    },

    // ========== KNITTED ARTICLES ==========
    {
        article_name: 'Knitted Crew Neck',
        category: 'knitted',
        gsm: 240,
        fabric_name: 'Knitted Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Beige', 'Grey', 'Navy', 'Olive'],
        price_min: 300,
        price_max: 380,
        min_order: 30,
        description: 'Textured knit pattern for a unique look.',
        tag: null,
        images: ['knitted-beige.jpg', 'knitted-grey.jpg'],
    },
    {
        article_name: 'Cable Knit Tee',
        category: 'knitted',
        gsm: 260,
        fabric_name: 'Premium Knit Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Cream', 'Grey', 'Black'],
        price_min: 350,
        price_max: 420,
        min_order: 30,
        description: 'Classic cable knit pattern with premium feel.',
        tag: 'bestseller',
        images: ['knitted-beige.jpg', 'knitted-olive.jpg'],
    },
    {
        article_name: 'Waffle Knit Tee',
        category: 'knitted',
        gsm: 230,
        fabric_name: 'Waffle Knit Cotton',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Grey', 'Olive', 'Navy'],
        price_min: 320,
        price_max: 390,
        min_order: 50,
        description: 'Unique waffle texture for modern appeal.',
        tag: 'new',
        images: ['knitted-grey.jpg', 'knitted-olive.jpg'],
    },
    {
        article_name: 'Ribbed Knit Tee',
        category: 'knitted',
        gsm: 220,
        fabric_name: 'Ribbed Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Olive', 'Black', 'Grey'],
        price_min: 280,
        price_max: 350,
        min_order: 50,
        description: 'Vertical ribbed knit for slimming effect.',
        tag: null,
        images: ['knitted-olive.jpg', 'knitted-tshirt.jpg'],
    },
    {
        article_name: 'Textured Knit Premium',
        category: 'knitted',
        gsm: 250,
        fabric_name: 'Premium Knit Blend',
        sizes: ['M', 'L', 'XL'],
        colors: ['Beige', 'Charcoal', 'Navy'],
        price_min: 380,
        price_max: 450,
        min_order: 30,
        description: 'Premium textured knit for luxury collections.',
        tag: 'bestseller',
        images: ['knitted-tshirt.jpg', 'knitted-beige.jpg'],
    },

    // ========== SILICON ARTICLES ==========
    {
        article_name: 'Silicon Print Premium',
        category: 'silicon',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Navy'],
        price_min: 200,
        price_max: 260,
        min_order: 50,
        description: 'Durable silicon print with smooth finish.',
        tag: 'new',
        images: ['silicon-black.jpg', 'silicon-white.jpg'],
    },
    {
        article_name: 'Glossy Silicon Logo',
        category: 'silicon',
        gsm: 190,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Maroon'],
        price_min: 220,
        price_max: 280,
        min_order: 50,
        description: 'High-gloss silicon print for premium branding.',
        tag: 'bestseller',
        images: ['silicon-navy.jpg', 'silicon-black.jpg'],
    },
    {
        article_name: 'Matte Silicon Print',
        category: 'silicon',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Grey', 'Black'],
        price_min: 190,
        price_max: 250,
        min_order: 75,
        description: 'Subtle matte silicon finish for understated style.',
        tag: null,
        images: ['silicon-white.jpg', 'silicon-tshirt.jpg'],
    },
    {
        article_name: 'Raised Silicon Design',
        category: 'silicon',
        gsm: 200,
        fabric_name: 'Premium Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'White'],
        price_min: 240,
        price_max: 300,
        min_order: 50,
        description: '3D raised silicon print for tactile experience.',
        tag: 'new',
        images: ['silicon-tshirt.jpg', 'silicon-navy.jpg'],
    },
    {
        article_name: 'Silicon Gradient Print',
        category: 'silicon',
        gsm: 180,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Navy', 'Black', 'Grey'],
        price_min: 230,
        price_max: 290,
        min_order: 50,
        description: 'Gradient silicon print for modern aesthetics.',
        tag: null,
        images: ['silicon-black.jpg', 'silicon-white.jpg'],
    },

    // ========== PATCH ARTICLES ==========
    {
        article_name: 'Patch Work Tee',
        category: 'patch',
        gsm: 180,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'Olive', 'Navy'],
        price_min: 220,
        price_max: 280,
        min_order: 30,
        description: 'Premium patches applied on quality fabric.',
        tag: null,
        images: ['patch-black.jpg', 'patch-olive.jpg'],
    },
    {
        article_name: 'Military Patch Tee',
        category: 'patch',
        gsm: 200,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Olive', 'Black', 'Khaki'],
        price_min: 250,
        price_max: 320,
        min_order: 50,
        description: 'Military-inspired patch designs for rugged look.',
        tag: 'bestseller',
        images: ['patch-olive.jpg', 'patch-navy.jpg'],
    },
    {
        article_name: 'Vintage Badge Tee',
        category: 'patch',
        gsm: 180,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'Grey'],
        price_min: 240,
        price_max: 300,
        min_order: 50,
        description: 'Retro vintage badges for nostalgic appeal.',
        tag: 'new',
        images: ['patch-navy.jpg', 'patch-black.jpg'],
    },
    {
        article_name: 'Multi-Patch Premium',
        category: 'patch',
        gsm: 190,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        price_min: 280,
        price_max: 350,
        min_order: 30,
        description: 'Multiple premium patches for statement look.',
        tag: null,
        images: ['patch-black.jpg', 'patch-tshirt.jpg'],
    },
    {
        article_name: 'Logo Patch Tee',
        category: 'patch',
        gsm: 180,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Olive', 'Black', 'Navy'],
        price_min: 230,
        price_max: 290,
        min_order: 50,
        description: 'Custom logo patch placement for brand identity.',
        tag: 'bestseller',
        images: ['patch-tshirt.jpg', 'patch-olive.jpg'],
    },

    // ========== DOWN-SHOULDER ARTICLES ==========
    {
        article_name: 'Oversized Drop Shoulder',
        category: 'downshoulder',
        gsm: 200,
        fabric_name: '100% Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Beige', 'Sage'],
        price_min: 180,
        price_max: 230,
        min_order: 50,
        description: 'Trendy oversized fit with dropped shoulders.',
        tag: 'bestseller',
        images: ['downshoulder-black.jpg', 'downshoulder-white.jpg'],
    },
    {
        article_name: 'Relaxed Drop Tee',
        category: 'downshoulder',
        gsm: 180,
        fabric_name: 'Cotton Blend',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Charcoal', 'Sand', 'Dusty Pink'],
        price_min: 160,
        price_max: 200,
        min_order: 50,
        description: 'Comfortable relaxed fit drop shoulder design.',
        tag: null,
        images: ['downshoulder-beige.jpg', 'downshoulder-sage.jpg'],
    },
    {
        article_name: 'Streetwear Drop Tee',
        category: 'downshoulder',
        gsm: 220,
        fabric_name: 'Heavy Cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Olive'],
        price_min: 200,
        price_max: 260,
        min_order: 50,
        description: 'Street style inspired drop shoulder with premium weight.',
        tag: 'new',
        images: ['down-shoulder-tshirt.jpg', 'downshoulder-black.jpg'],
    },
    {
        article_name: 'Pastel Drop Shoulder',
        category: 'downshoulder',
        gsm: 180,
        fabric_name: 'Soft Cotton',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Sage', 'Lavender', 'Peach', 'Sky Blue'],
        price_min: 170,
        price_max: 220,
        min_order: 75,
        description: 'Soft pastel colors in trendy drop shoulder style.',
        tag: null,
        images: ['downshoulder-sage.jpg', 'downshoulder-beige.jpg'],
    },
    {
        article_name: 'Premium Boxy Drop Tee',
        category: 'downshoulder',
        gsm: 200,
        fabric_name: 'Premium Cotton',
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'White', 'Beige'],
        price_min: 190,
        price_max: 250,
        min_order: 50,
        description: 'Boxy silhouette with premium drop shoulder construction.',
        tag: 'bestseller',
        images: ['downshoulder-white.jpg', 'down-shoulder-tshirt.jpg'],
    },
];

async function clearDatabase() {
    console.log('🗑️  Clearing existing data...');

    // Delete all product images records
    const { error: imgError } = await supabase
        .from('product_images')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (imgError && !imgError.message.includes('no rows')) {
        console.log('Note: Could not delete product_images:', imgError.message);
    }

    // Delete all products
    const { error: prodError } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (prodError && !prodError.message.includes('no rows')) {
        console.log('Note: Could not delete products:', prodError.message);
    }

    // Clear storage bucket
    const { data: files } = await supabase.storage
        .from('product-images')
        .list('', { limit: 1000 });

    if (files && files.length > 0) {
        // List all folders
        for (const folder of files) {
            if (folder.name) {
                const { data: folderFiles } = await supabase.storage
                    .from('product-images')
                    .list(folder.name, { limit: 100 });

                if (folderFiles && folderFiles.length > 0) {
                    const filePaths = folderFiles.map(f => `${folder.name}/${f.name}`);
                    await supabase.storage.from('product-images').remove(filePaths);
                }
            }
        }
    }

    console.log('✅ Database cleared');
}

async function uploadImage(productId, imageName) {
    const imagePath = join(OLD_IMAGES_PATH, imageName);

    try {
        const fileBuffer = readFileSync(imagePath);
        const fileName = `${productId}/${Date.now()}-${imageName}`;

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (error) {
            console.log(`  ⚠️  Failed to upload ${imageName}:`, error.message);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (err) {
        console.log(`  ⚠️  Image not found: ${imageName}`);
        return null;
    }
}

async function seedProducts() {
    console.log('\n🌱 Seeding products...\n');

    let successCount = 0;

    for (const product of products) {
        console.log(`📦 Adding: ${product.article_name}`);

        // Insert product
        const { data: insertedProduct, error: productError } = await supabase
            .from('products')
            .insert({
                article_name: product.article_name,
                category: product.category,
                gsm: product.gsm,
                fabric_name: product.fabric_name,
                sizes: product.sizes,
                colors: product.colors,
                price_min: product.price_min,
                price_max: product.price_max,
                min_order: product.min_order,
                description: product.description,
                tag: product.tag,
                is_active: true,
            })
            .select()
            .single();

        if (productError) {
            console.log(`  ❌ Failed:`, productError.message);
            continue;
        }

        // Upload images
        let imageOrder = 0;
        for (const imageName of product.images) {
            const imageUrl = await uploadImage(insertedProduct.id, imageName);

            if (imageUrl) {
                await supabase.from('product_images').insert({
                    product_id: insertedProduct.id,
                    image_url: imageUrl,
                    display_order: imageOrder++,
                });
                console.log(`  📷 Uploaded: ${imageName}`);
            }
        }

        successCount++;
    }

    console.log(`\n✅ Seeding complete! Added ${successCount} products.`);
}

async function main() {
    console.log('🚀 TopWhite Product Seeder\n');
    console.log('Supabase URL:', SUPABASE_URL);

    try {
        await clearDatabase();
        await seedProducts();
        console.log('\n🎉 Done!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
