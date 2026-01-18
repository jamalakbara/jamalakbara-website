/**
 * Cloudinary utility for generating optimized image URLs
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!CLOUD_NAME) {
    console.warn(
        'Warning: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Cloudinary URLs will not work.'
    );
}

interface CloudinaryOptions {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
    gravity?: 'auto' | 'face' | 'center';
}

/**
 * Generate a Cloudinary URL with automatic optimizations
 * @param publicId - The public ID of the image in Cloudinary (e.g., 'portfolio/sonderlab-project')
 * @param options - Optional transformations
 * @returns Optimized Cloudinary URL
 */
export function getCloudinaryUrl(publicId: string, options: CloudinaryOptions = {}): string {
    if (!CLOUD_NAME) {
        // Fallback to local path if Cloudinary is not configured
        return `/${publicId}`;
    }

    const transforms: string[] = [];

    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.gravity) transforms.push(`g_${options.gravity}`);

    // Default to auto quality and format for best optimization
    transforms.push(`q_${options.quality || 'auto'}`);
    transforms.push(`f_${options.format || 'auto'}`);

    const transformString = transforms.join(',');

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Generate a Cloudinary URL for project images
 * Uses folder structure: portfolio/[image-name]
 */
export function getProjectImageUrl(imageName: string, options: CloudinaryOptions = {}): string {
    // Remove leading slash and file extension if present
    const cleanName = imageName.replace(/^\//, '').replace(/\.(png|jpg|jpeg|webp)$/, '');
    return getCloudinaryUrl(`portfolio/${cleanName}`, options);
}

/**
 * Get the base Cloudinary URL for direct use
 */
export function getCloudinaryBaseUrl(): string {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
}
