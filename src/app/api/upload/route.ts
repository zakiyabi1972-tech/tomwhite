import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role for uploads
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Image variant specifications from PRD
const IMAGE_VARIANTS = {
    thumbnail: { width: 200, height: 200, quality: 75 },
    catalog: { width: 600, height: 600, quality: 80 },
    zoom: { width: 1200, height: 1200, quality: 85 },
} as const;

interface UploadResult {
    thumbnail: string;
    catalog: string;
    zoom: string;
    original: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const productId = formData.get('productId') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!productId) {
            return NextResponse.json(
                { error: 'No productId provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload JPG, PNG, or WebP.' },
                { status: 400 }
            );
        }

        // Get file buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const baseName = file.name.replace(/\.[^/.]+$/, '');

        const urls: UploadResult = {
            thumbnail: '',
            catalog: '',
            zoom: '',
            original: '',
        };

        // Process each variant
        for (const [variant, config] of Object.entries(IMAGE_VARIANTS)) {
            try {
                // Process image with Sharp
                const processedBuffer = await sharp(buffer)
                    .resize(config.width, config.height, {
                        fit: 'cover',
                        position: 'center',
                    })
                    .webp({ quality: config.quality })
                    .toBuffer();

                const fileName = `${productId}/${timestamp}-${baseName}-${variant}.webp`;

                // Upload to Supabase Storage
                const { error: uploadError } = await supabaseAdmin.storage
                    .from('product-images')
                    .upload(fileName, processedBuffer, {
                        contentType: 'image/webp',
                        upsert: true,
                    });

                if (uploadError) {
                    console.error(`Upload error for ${variant}:`, uploadError);
                    continue;
                }

                // Get public URL
                const { data: urlData } = supabaseAdmin.storage
                    .from('product-images')
                    .getPublicUrl(fileName);

                urls[variant as keyof UploadResult] = urlData.publicUrl;
            } catch (variantError) {
                console.error(`Error processing ${variant}:`, variantError);
            }
        }

        // Also upload original (compressed)
        try {
            const originalBuffer = await sharp(buffer)
                .webp({ quality: 90 })
                .toBuffer();

            const originalFileName = `${productId}/${timestamp}-${baseName}-original.webp`;

            const { error: uploadError } = await supabaseAdmin.storage
                .from('product-images')
                .upload(originalFileName, originalBuffer, {
                    contentType: 'image/webp',
                    upsert: true,
                });

            if (!uploadError) {
                const { data: urlData } = supabaseAdmin.storage
                    .from('product-images')
                    .getPublicUrl(originalFileName);
                urls.original = urlData.publicUrl;
            }
        } catch (originalError) {
            console.error('Error uploading original:', originalError);
        }

        // Return the catalog URL as the main image_url (for backward compatibility)
        return NextResponse.json({
            success: true,
            urls,
            image_url: urls.catalog || urls.original, // Primary URL for database
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
