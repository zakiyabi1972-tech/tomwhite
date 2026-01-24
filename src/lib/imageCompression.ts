import imageCompression from 'browser-image-compression';

/**
 * Production-grade image compression settings
 */
export interface ImageCompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    initialQuality?: number;
    convertToWebP?: boolean;
}

export const PRODUCT_IMAGE_DEFAULTS: Required<ImageCompressionOptions> = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    initialQuality: 0.85,
    convertToWebP: true,
};

/**
 * Compresses an image file
 */
export async function compressImage(
    file: File,
    options: ImageCompressionOptions = {}
): Promise<File> {
    const settings = { ...PRODUCT_IMAGE_DEFAULTS, ...options };

    const originalSize = file.size / 1024 / 1024;
    console.log(`[ImageCompression] Original: ${file.name} - ${originalSize.toFixed(2)}MB`);

    try {
        const fileType = settings.convertToWebP ? 'image/webp' : file.type;

        const compressionOptions = {
            maxSizeMB: settings.maxSizeMB,
            maxWidthOrHeight: settings.maxWidthOrHeight,
            useWebWorker: settings.useWebWorker,
            initialQuality: settings.initialQuality,
            fileType: fileType,
            preserveExif: false,
        };

        const compressedBlob = await imageCompression(file, compressionOptions);

        const extension = settings.convertToWebP ? 'webp' : file.name.split('.').pop();
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const newFileName = `${baseName}.${extension}`;

        const compressedFile = new File([compressedBlob], newFileName, {
            type: fileType,
            lastModified: Date.now(),
        });

        const compressedSize = compressedFile.size / 1024 / 1024;
        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

        console.log(`[ImageCompression] Compressed: ${newFileName} - ${compressedSize.toFixed(2)}MB (${savings}% reduction)`);

        return compressedFile;
    } catch (error) {
        console.error('[ImageCompression] Error:', error);
        return file;
    }
}

/**
 * Validates image file before compression
 */
export function validateImageFile(file: File): string | null {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        return `Invalid file type: ${file.type}. Supported: JPEG, PNG, WebP, GIF`;
    }

    const maxProcessableSize = 20 * 1024 * 1024;
    if (file.size > maxProcessableSize) {
        return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 20MB`;
    }

    return null;
}
