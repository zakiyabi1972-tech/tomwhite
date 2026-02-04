'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, LogOut, Upload, X, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/hooks/useProducts';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { compressImage, validateImageFile } from '@/lib/imageCompression';
import { SIZES, TAGS, type ProductCategory, type ProductTag } from '@/types/database';
import { useSiteSettings, parseCategories } from '@/hooks/useSiteSettings';

interface ProductFormProps {
    productId?: string;
}

interface FormData {
    article_name: string;
    fabric_name: string;
    gsm: string;  // Store as string for better UX
    sizes: string[];
    colors: string[];
    price_min: string;  // Store as string for better UX
    price_max: string;  // Store as string for better UX
    min_order: string;  // Store as string for better UX
    description: string;
    category: ProductCategory;
    tag: ProductTag | null;
    is_active: boolean;
}

const initialFormData: FormData = {
    article_name: '',
    fabric_name: '',
    gsm: '180',
    sizes: ['M', 'L', 'XL'],
    colors: [],
    price_min: '',
    price_max: '',
    min_order: '50',
    description: '',
    category: 'plain',
    tag: null,
    is_active: true,
};

function ProductFormContent({ productId }: ProductFormProps) {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: settings } = useSiteSettings();

    const isEditMode = !!productId;
    const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(productId || '');

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
    const [colorInput, setColorInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load existing product data when product is fetched
    useEffect(() => {
        if (existingProduct) {
            setFormData({
                article_name: existingProduct.article_name,
                fabric_name: existingProduct.fabric_name,
                gsm: String(existingProduct.gsm),
                sizes: existingProduct.sizes,
                colors: existingProduct.colors,
                price_min: String(existingProduct.price_min),
                price_max: existingProduct.price_max ? String(existingProduct.price_max) : '',
                min_order: String(existingProduct.min_order),
                description: existingProduct.description || '',
                category: existingProduct.category,
                tag: existingProduct.tag,
                is_active: existingProduct.is_active ?? true,
            });
            setExistingImages(
                existingProduct.images.map(img => ({ id: img.id, url: img.image_url }))
            );
        }
    }, [existingProduct]);

    // Handle file selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        for (const file of files) {
            const error = validateImageFile(file);
            if (error) {
                toast.error(error);
                continue;
            }

            toast.promise(
                compressImage(file),
                {
                    loading: `Compressing ${file.name}...`,
                    success: (compressedFile) => {
                        setImageFiles(prev => [...prev, compressedFile]);
                        return `Compressed ${file.name}`;
                    },
                    error: 'Failed to compress image',
                }
            );
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove new image
    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing image
    const removeExistingImage = async (imageId: string, imageUrl: string) => {
        try {
            // Delete from storage
            const path = imageUrl.split('/product-images/')[1];
            if (path) {
                await supabase.storage.from('product-images').remove([path]);
            }

            // Delete from database
            await supabase.from('product_images').delete().eq('id', imageId);

            setExistingImages(prev => prev.filter(img => img.id !== imageId));
            toast.success('Image removed');
        } catch (error) {
            console.error('Error removing image:', error);
            toast.error('Failed to remove image');
        }
    };

    // Add color
    const addColor = () => {
        if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, colorInput.trim()],
            }));
            setColorInput('');
        }
    };

    // Remove color
    const removeColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color),
        }));
    };

    // Toggle size
    const toggleSize = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert string values to numbers for validation and submission
        const gsmNum = parseInt(formData.gsm) || 0;
        const priceMinNum = parseFloat(formData.price_min) || 0;
        const priceMaxNum = formData.price_max ? parseFloat(formData.price_max) : null;
        const minOrderNum = parseInt(formData.min_order) || 50;

        if (!formData.article_name || !formData.fabric_name || gsmNum < 100) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.sizes.length === 0) {
            toast.error('Please select at least one size');
            return;
        }

        if (imageFiles.length === 0 && existingImages.length === 0) {
            toast.error('Please add at least one image');
            return;
        }

        setIsSubmitting(true);

        try {
            let productId = isEditMode ? existingProduct?.id : null;

            // Create or update product
            if (isEditMode && productId) {
                const { error } = await supabase
                    .from('products')
                    .update({
                        article_name: formData.article_name,
                        fabric_name: formData.fabric_name,
                        gsm: gsmNum,
                        sizes: formData.sizes,
                        colors: formData.colors,
                        price_min: priceMinNum,
                        price_max: priceMaxNum,
                        min_order: minOrderNum,
                        description: formData.description || null,
                        category: formData.category,
                        tag: formData.tag,
                        is_active: formData.is_active,
                    })
                    .eq('id', productId);

                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert({
                        article_name: formData.article_name,
                        fabric_name: formData.fabric_name,
                        gsm: gsmNum,
                        sizes: formData.sizes,
                        colors: formData.colors,
                        price_min: priceMinNum,
                        price_max: priceMaxNum,
                        min_order: minOrderNum,
                        description: formData.description || null,
                        category: formData.category,
                        tag: formData.tag,
                        is_active: formData.is_active,
                    })
                    .select('id')
                    .single();

                if (error) throw error;
                productId = data.id;
            }

            // Upload new images via Sharp.js API
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];

                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('productId', productId!);

                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Upload error:', errorData);
                        toast.error(`Failed to upload ${file.name}`);
                        continue;
                    }

                    const data = await response.json();

                    // Store the catalog URL as main image
                    await supabase.from('product_images').insert({
                        product_id: productId,
                        image_url: data.image_url || data.urls?.catalog,
                        display_order: existingImages.length + i,
                    });
                } catch (uploadErr) {
                    console.error('Upload error:', uploadErr);
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            toast.success(isEditMode ? 'Product updated!' : 'Product created!');
            router.push('/admin/products');
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEditMode && isLoadingProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto py-4 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <span className="font-display font-semibold">
                                {isEditMode ? 'Edit Product' : 'Add Product'}
                            </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => signOut()}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>Upload up to 5 product images (will be compressed automatically)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                {/* Existing Images */}
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border">
                                        <Image src={img.url} alt="" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id, img.url)}
                                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Images */}
                                {imageFiles.map((file, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                                        <Image src={URL.createObjectURL(file)} alt="" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                {(existingImages.length + imageFiles.length) < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors"
                                    >
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">Add</span>
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </CardContent>
                    </Card>

                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="article_name">Article Name *</Label>
                                    <Input
                                        id="article_name"
                                        value={formData.article_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, article_name: e.target.value }))}
                                        placeholder="e.g., Premium Cotton Tee"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fabric_name">Fabric Name *</Label>
                                    <Input
                                        id="fabric_name"
                                        value={formData.fabric_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fabric_name: e.target.value }))}
                                        placeholder="e.g., 100% Cotton"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gsm">GSM *</Label>
                                    <Input
                                        id="gsm"
                                        type="number"
                                        min={100}
                                        max={400}
                                        value={formData.gsm}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gsm: e.target.value }))}
                                        placeholder="180"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ProductCategory }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parseCategories(settings).map((cat) => (
                                                <SelectItem key={cat.slug} value={cat.slug}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tag">Tag (Optional)</Label>
                                    <Select
                                        value={formData.tag || 'none'}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value === 'none' ? null : value as ProductTag }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Tag</SelectItem>
                                            {TAGS.map((tag) => (
                                                <SelectItem key={tag.value} value={tag.value}>
                                                    {tag.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sizes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sizes *</CardTitle>
                            <CardDescription>Select available sizes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${formData.sizes.includes(size)
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-card border-border hover:border-primary'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Colors (Optional)</CardTitle>
                            <CardDescription>Add available colors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-3">
                                <Input
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    placeholder="e.g., Black"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addColor();
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" onClick={addColor}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.colors.map((color) => (
                                    <Badge key={color} variant="secondary" className="gap-1">
                                        {color}
                                        <button type="button" onClick={() => removeColor(color)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price_min">Minimum Price (₹) *</Label>
                                    <Input
                                        id="price_min"
                                        type="number"
                                        min={0}
                                        value={formData.price_min}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price_min: e.target.value }))}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price_max">Maximum Price (₹)</Label>
                                    <Input
                                        id="price_max"
                                        type="number"
                                        min={0}
                                        value={formData.price_max}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price_max: e.target.value }))}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min_order">Minimum Order *</Label>
                                    <Input
                                        id="min_order"
                                        type="number"
                                        min={1}
                                        value={formData.min_order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, min_order: e.target.value }))}
                                        placeholder="50"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Add product description..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
                                />
                                <Label htmlFor="is_active" className="font-normal">
                                    Active (visible in catalog)
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEditMode ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                isEditMode ? 'Update Product' : 'Create Product'
                            )}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export function ProductForm({ productId }: ProductFormProps) {
    return (
        <ProtectedRoute>
            <ProductFormContent productId={productId} />
        </ProtectedRoute>
    );
}
