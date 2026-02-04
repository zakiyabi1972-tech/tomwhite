'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, LogOut, Loader2, Search, Ruler, Smartphone, FolderTree, Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings, useUpdateSiteSettings, parseSizeChart, parseCategories, DEFAULT_SIZE_CHART, SizeChartData } from '@/hooks/useSiteSettings';
import { SIZES, Category, AVAILABLE_ICONS, DEFAULT_CATEGORIES } from '@/types/database';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

function SettingsContent() {
    const { user, signOut } = useAuth();
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettings = useUpdateSiteSettings();

    const [formData, setFormData] = useState({
        whatsapp_primary: '',
        whatsapp_secondary: '',
        business_name: '',
        business_address: '',
        business_email: '',
        min_order_default: '50',
        search_enabled: 'false',
        store_map_url: '',
        category_scrollable: 'false',
        business_hours: '',
        store_location_name: '',
        google_maps_embed_url: '',
    });

    const [sizeChartData, setSizeChartData] = useState<SizeChartData>(DEFAULT_SIZE_CHART);

    // Categories state
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryForm, setCategoryForm] = useState<Category>({
        slug: '',
        name: '',
        description: '',
        icon: 'plain.png',
        order: 1,
        active: true,
    });
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [categoryProductCounts, setCategoryProductCounts] = useState<Record<string, number>>({});
    const [loadingProductCounts, setLoadingProductCounts] = useState(true);

    // Load product counts per category for deletion protection
    useEffect(() => {
        async function loadProductCounts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('category');

                if (error) throw error;

                const counts: Record<string, number> = {};
                (data || []).forEach(product => {
                    counts[product.category] = (counts[product.category] || 0) + 1;
                });
                setCategoryProductCounts(counts);
            } catch (error) {
                console.error('Error loading product counts:', error);
            } finally {
                setLoadingProductCounts(false);
            }
        }
        loadProductCounts();
    }, []);

    useEffect(() => {
        if (settings) {
            setFormData({
                whatsapp_primary: settings.whatsapp_primary,
                whatsapp_secondary: settings.whatsapp_secondary,
                business_name: settings.business_name,
                business_address: settings.business_address,
                business_email: settings.business_email,
                min_order_default: settings.min_order_default,
                search_enabled: settings.search_enabled || 'false',
                store_map_url: settings.store_map_url || '',
                category_scrollable: settings.category_scrollable || 'false',
                business_hours: settings.business_hours || '',
                store_location_name: settings.store_location_name || '',
                google_maps_embed_url: settings.google_maps_embed_url || '',
            });
            setSizeChartData(parseSizeChart(settings));
            setCategories(parseCategories(settings));
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateSettings.mutateAsync({
                ...formData,
                size_chart: JSON.stringify(sizeChartData),
                categories: JSON.stringify(categories),
            });
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Settings error:', error);
            toast.error('Failed to save settings');
        }
    };

    const handleSearchToggle = (checked: boolean) => {
        setFormData(prev => ({ ...prev, search_enabled: checked ? 'true' : 'false' }));
    };

    const handleCategoryLayoutToggle = (checked: boolean) => {
        setFormData(prev => ({ ...prev, category_scrollable: checked ? 'true' : 'false' }));
    };

    // Category CRUD handlers
    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
    };

    const openAddCategory = () => {
        setEditingCategory(null);
        setCategoryForm({
            slug: '',
            name: '',
            description: '',
            icon: 'plain.png',
            order: Math.max(...categories.map(c => c.order), 0) + 1,
            active: true,
        });
        setCategoryModalOpen(true);
    };

    const openEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryForm({ ...category });
        setCategoryModalOpen(true);
    };

    const handleCategoryFormChange = (field: keyof Category, value: string | number | boolean) => {
        setCategoryForm(prev => {
            const updated = { ...prev, [field]: value };
            // Auto-generate slug from name if adding new and slug is empty
            if (field === 'name' && !editingCategory && !prev.slug) {
                updated.slug = generateSlug(value as string);
            }
            return updated;
        });
    };

    const saveCategory = () => {
        if (!categoryForm.name.trim()) {
            toast.error('Category name is required');
            return;
        }
        if (!categoryForm.slug.trim()) {
            categoryForm.slug = generateSlug(categoryForm.name);
        }

        // Check for duplicate slugs
        const slugExists = categories.some(c =>
            c.slug === categoryForm.slug && c.slug !== editingCategory?.slug
        );
        if (slugExists) {
            toast.error('A category with this slug already exists');
            return;
        }

        if (editingCategory) {
            // Update existing
            setCategories(prev =>
                prev.map(c => c.slug === editingCategory.slug ? categoryForm : c)
            );
            toast.success('Category updated');
        } else {
            // Add new
            setCategories(prev => [...prev, categoryForm]);
            toast.success('Category added');
        }
        setCategoryModalOpen(false);
    };

    const deleteCategory = (slug: string) => {
        const productCount = categoryProductCounts[slug] || 0;
        if (productCount > 0) {
            toast.error(`Cannot delete: ${productCount} product(s) use this category`);
            return;
        }
        setCategories(prev => prev.filter(c => c.slug !== slug));
        toast.success('Category deleted');
    };

    const moveCategory = (slug: string, direction: 'up' | 'down') => {
        const sorted = [...categories].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex(c => c.slug === slug);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === sorted.length - 1)) {
            return;
        }
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const tempOrder = sorted[index].order;
        sorted[index].order = sorted[swapIndex].order;
        sorted[swapIndex].order = tempOrder;
        setCategories(sorted);
    };


    if (isLoading) {
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
                            <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <span className="font-display font-semibold">Settings</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {user?.email}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => signOut()}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 max-w-2xl">
                <h1 className="text-3xl font-display font-bold mb-6">Site Settings</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Feature Toggles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Toggles</CardTitle>
                            <CardDescription>Enable or disable site features</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Search className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <Label htmlFor="search_enabled" className="text-base font-medium">
                                            Product Search
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Show search bar in the products section
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="search_enabled"
                                    checked={formData.search_enabled === 'true'}
                                    onCheckedChange={handleSearchToggle}
                                />
                            </div>

                            {/* Scrollable Categories Toggle */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Smartphone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <Label htmlFor="category_scrollable" className="text-base font-medium">
                                            Mobile Scrollable Categories
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Show swipeable category strip on mobile devices
                                        </p>
                                    </div>
                                </div>
                                <Switch
                                    id="category_scrollable"
                                    checked={formData.category_scrollable === 'true'}
                                    onCheckedChange={handleCategoryLayoutToggle}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Numbers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>WhatsApp Numbers</CardTitle>
                            <CardDescription>These numbers will be used for customer inquiries</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp_primary">Primary WhatsApp (with country code)</Label>
                                <Input
                                    id="whatsapp_primary"
                                    value={formData.whatsapp_primary}
                                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_primary: e.target.value }))}
                                    placeholder="e.g., 919599965931"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: Country code + number without + (e.g., 919599965931 for +91 9599965931)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp_secondary">Secondary WhatsApp (optional)</Label>
                                <Input
                                    id="whatsapp_secondary"
                                    value={formData.whatsapp_secondary}
                                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_secondary: e.target.value }))}
                                    placeholder="e.g., 919582142143"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>General business details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="business_name">Business Name</Label>
                                <Input
                                    id="business_name"
                                    value={formData.business_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                                    placeholder="e.g., Tom White"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business_email">Business Email (optional)</Label>
                                <Input
                                    id="business_email"
                                    type="email"
                                    value={formData.business_email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, business_email: e.target.value }))}
                                    placeholder="e.g., contact@tomwhite.in"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business_address">Business Address</Label>
                                <Textarea
                                    id="business_address"
                                    value={formData.business_address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, business_address: e.target.value }))}
                                    placeholder="Enter your business address"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business_hours">Business Hours</Label>
                                <Input
                                    id="business_hours"
                                    value={formData.business_hours}
                                    onChange={(e) => setFormData(prev => ({ ...prev, business_hours: e.target.value }))}
                                    placeholder="e.g., Mon - Sat: 10:00 AM - 8:00 PM"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_location_name">Store Location Name</Label>
                                <Input
                                    id="store_location_name"
                                    value={formData.store_location_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, store_location_name: e.target.value }))}
                                    placeholder="e.g., Karol Bagh, New Delhi"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Short location name displayed on the map section
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_map_url">Store Location Map URL</Label>
                                <Input
                                    id="store_map_url"
                                    value={formData.store_map_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, store_map_url: e.target.value }))}
                                    placeholder="e.g., https://maps.google.com/?q=28.6519,77.1900"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Google Maps URL for the &quot;Get Directions&quot; button
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="google_maps_embed_url">Google Maps Embed URL</Label>
                                <Textarea
                                    id="google_maps_embed_url"
                                    value={formData.google_maps_embed_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, google_maps_embed_url: e.target.value }))}
                                    placeholder="Paste the Google Maps embed URL here"
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    To get this: Go to Google Maps → Search your location → Click Share → Embed a map → Copy the src URL from the iframe code
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Management */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <FolderTree className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Product Categories</CardTitle>
                                        <CardDescription>Add, edit, or remove product categories</CardDescription>
                                    </div>
                                </div>
                                <Button size="sm" onClick={openAddCategory}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[...categories].sort((a, b) => a.order - b.order).map((category, index, arr) => {
                                    const productCount = categoryProductCounts[category.slug] || 0;
                                    return (
                                        <div
                                            key={category.slug}
                                            className={`flex items-center gap-3 p-3 rounded-lg border ${!category.active ? 'opacity-50 bg-muted/50' : 'bg-card'}`}
                                        >
                                            {/* Icon Preview */}
                                            <div className="w-10 h-10 relative flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                                                <Image
                                                    src={`/icons/${category.icon}`}
                                                    alt={category.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>

                                            {/* Name & Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{category.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {category.slug} • {productCount} product{productCount !== 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <span className={`text-xs px-2 py-0.5 rounded ${category.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                {category.active ? 'Active' : 'Hidden'}
                                            </span>

                                            {/* Reorder buttons */}
                                            <div className="flex flex-col">
                                                <button
                                                    type="button"
                                                    className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                                                    onClick={() => moveCategory(category.slug, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <ChevronUp className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                                                    onClick={() => moveCategory(category.slug, 'down')}
                                                    disabled={index === arr.length - 1}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => openEditCategory(category)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => deleteCategory(category.slug)}
                                                    disabled={productCount > 0}
                                                    title={productCount > 0 ? `Cannot delete: ${productCount} product(s) use this category` : 'Delete category'}
                                                >
                                                    {productCount > 0 ? (
                                                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Categories with products cannot be deleted. Reorder with arrows.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Defaults */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Default Values</CardTitle>
                            <CardDescription>Default values for new products</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="min_order_default">Default Minimum Order</Label>
                                <Input
                                    id="min_order_default"
                                    type="number"
                                    min={1}
                                    value={formData.min_order_default}
                                    onChange={(e) => setFormData(prev => ({ ...prev, min_order_default: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Size Chart */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Ruler className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Size Chart</CardTitle>
                                    <CardDescription>Edit T-shirt measurements (applies to all products)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-semibold">Size</th>
                                            <th className="text-center py-2 px-3 font-semibold">Chest</th>
                                            <th className="text-center py-2 px-3 font-semibold">Length</th>
                                            <th className="text-center py-2 px-3 font-semibold">Shoulder</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SIZES.map((size) => {
                                            const measurements = sizeChartData[size];
                                            if (!measurements) return null;
                                            return (
                                                <tr key={size} className="border-b">
                                                    <td className="py-2 px-3 font-medium">{size}</td>
                                                    <td className="py-1 px-2">
                                                        <Input
                                                            value={measurements.chest}
                                                            onChange={(e) => setSizeChartData(prev => ({
                                                                ...prev,
                                                                [size]: { ...prev[size], chest: e.target.value }
                                                            }))}
                                                            className="text-center h-8"
                                                        />
                                                    </td>
                                                    <td className="py-1 px-2">
                                                        <Input
                                                            value={measurements.length}
                                                            onChange={(e) => setSizeChartData(prev => ({
                                                                ...prev,
                                                                [size]: { ...prev[size], length: e.target.value }
                                                            }))}
                                                            className="text-center h-8"
                                                        />
                                                    </td>
                                                    <td className="py-1 px-2">
                                                        <Input
                                                            value={measurements.shoulder}
                                                            onChange={(e) => setSizeChartData(prev => ({
                                                                ...prev,
                                                                [size]: { ...prev[size], shoulder: e.target.value }
                                                            }))}
                                                            className="text-center h-8"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Measurements are displayed in the product detail modal for customers.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={updateSettings.isPending}>
                        {updateSettings.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </Button>
                </form>
            </main>

            {/* Category Add/Edit Modal */}
            <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-name">Category Name *</Label>
                            <Input
                                id="cat-name"
                                value={categoryForm.name}
                                onChange={(e) => handleCategoryFormChange('name', e.target.value)}
                                placeholder="e.g., Polo Shirts"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-slug">Slug (URL identifier)</Label>
                            <Input
                                id="cat-slug"
                                value={categoryForm.slug}
                                onChange={(e) => handleCategoryFormChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                placeholder="e.g., poloshirts"
                                disabled={!!editingCategory && categoryProductCounts[editingCategory.slug] > 0}
                            />
                            {editingCategory && categoryProductCounts[editingCategory.slug] > 0 && (
                                <p className="text-xs text-amber-600">Slug cannot be changed when products use this category</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-desc">Description</Label>
                            <Input
                                id="cat-desc"
                                value={categoryForm.description}
                                onChange={(e) => handleCategoryFormChange('description', e.target.value)}
                                placeholder="e.g., Classic polo-style T-shirts"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cat-active">Active (visible on site)</Label>
                            <Switch
                                id="cat-active"
                                checked={categoryForm.active}
                                onCheckedChange={(checked) => handleCategoryFormChange('active', checked)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Category Icon</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {AVAILABLE_ICONS.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        className={`aspect-square rounded-lg border-2 p-2 transition-all hover:border-primary/50 ${categoryForm.icon === icon ? 'border-primary bg-primary/10' : 'border-border'}`}
                                        onClick={() => handleCategoryFormChange('icon', icon)}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={`/icons/${icon}`}
                                                alt={icon}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Selected: {categoryForm.icon}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={saveCategory}>
                            {editingCategory ? 'Save Changes' : 'Add Category'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function AdminSettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}
