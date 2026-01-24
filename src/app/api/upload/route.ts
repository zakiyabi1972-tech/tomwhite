import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role for uploads
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Image variants removed for Edge compatibility (Sharp not supported)
// const IMAGE_VARIANTS = { ... }

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
        // Sanitize filename
        const baseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${productId}/${timestamp}-${baseName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from('product-images')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // Return same URL for all variants (temporary solution for Edge compatibility)
        const urls: UploadResult = {
            thumbnail: publicUrl,
            catalog: publicUrl,
            zoom: publicUrl,
            original: publicUrl,
        };

        return NextResponse.json({
            success: true,
            urls,
            image_url: publicUrl,
        });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}


