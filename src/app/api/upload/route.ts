import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// Server-side Supabase client with service role for uploads
// Note: We initialize this inside the request handler now to access runtime env vars
// const supabaseAdmin = createClient(...) - REMOVED

// Image variants removed for Edge compatibility (Sharp not supported)
// const IMAGE_VARIANTS = { ... }

interface UploadResult {
    thumbnail: string;
    catalog: string;
    zoom: string;
    original: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    console.log('[Upload] Starting upload request from IP:', request.headers.get('CF-Connecting-IP') || 'unknown');
    console.log('[Upload] Runtime:', process.env.NEXT_RUNTIME);

    let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Try getting from Cloudflare Context (reliable for secrets in Edge)
    try {
        const { env } = getRequestContext();
        if (env) {
            const envKeys = Object.keys(env);

            // Robust lookup: Find key that matches "SUPABASE_SERVICE_ROLE_KEY" even with whitespace
            const targetKey = 'SUPABASE_SERVICE_ROLE_KEY';
            const realKey = envKeys.find(k => k.trim() === targetKey);

            if (realKey) {
                console.log(`[Upload] Found actual key '${realKey}' (length: ${realKey.length})`);
                const value = (env as any)[realKey];
                if (value) {
                    serviceRoleKey = value;
                    console.log('[Upload] Retrieved non-empty value using fuzzy match');
                } else {
                    console.log('[Upload] Key found but value is empty/falsy');
                }
            } else {
                console.log('[Upload] Exact match for SUPABASE_SERVICE_ROLE_KEY not found in keys');
            }
        } else {
            console.log('[Upload] getRequestContext().env is null/undefined');
        }
    } catch (e) {
        console.log('[Upload] getRequestContext() not available or failed', e);
    }

    // Debugging Env Vars (safely)
    console.log('[Upload] Env Check - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'MISSING');
    console.log('[Upload] Env Check - Service Role Key Available:', !!serviceRoleKey);

    if (!serviceRoleKey) {
        console.error('[Upload] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing! Uploads will likely fail (403)');
        return NextResponse.json(
            { error: 'Server configuration error: Missing Service Role Key' },
            { status: 500 }
        );
    }

    // Initialize Supabase Admin Client inside the request context with the resolved keys
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    );

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


