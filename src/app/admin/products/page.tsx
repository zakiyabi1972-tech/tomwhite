'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut, Plus, Search, Trash2, Edit, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminProducts, useDeleteProduct, useToggleProductActive } from '@/hooks/useProducts';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatPriceRange } from '@/types/database';

function ProductsContent() {
    const { user, signOut } = useAuth();
    const { data: products = [], isLoading } = useAdminProducts();
    const deleteProduct = useDeleteProduct();
    const toggleActive = useToggleProductActive();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    // Filter products by search query
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;

        const query = searchQuery.toLowerCase();
        return products.filter(p =>
            p.article_name.toLowerCase().includes(query) ||
            p.fabric_name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    // Toggle single product selection
    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Toggle all products selection
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    };

    // Delete single product
    const handleDelete = async (id: string) => {
        try {
            await deleteProduct.mutateAsync(id);
            toast.success('Product deleted successfully');
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete product');
        }
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    // Bulk delete selected products
    const handleBulkDelete = async () => {
        try {
            for (const id of selectedIds) {
                await deleteProduct.mutateAsync(id);
            }
            toast.success(`Deleted ${selectedIds.size} products`);
            setSelectedIds(new Set());
        } catch (error) {
            console.error('Bulk delete error:', error);
            toast.error('Failed to delete some products');
        }
        setDeleteDialogOpen(false);
    };

    // Toggle active status
    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await toggleActive.mutateAsync({ id, isActive: !currentStatus });
            toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Toggle error:', error);
            toast.error('Failed to update product status');
        }
    };

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
                            <span className="font-display font-semibold">Products</span>
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

            <main className="container mx-auto py-8 px-4">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold">Products</h1>
                        <p className="text-muted-foreground">{products.length} products total</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/products/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Link>
                    </Button>
                </div>

                {/* Search and Bulk Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setProductToDelete(null);
                                setDeleteDialogOpen(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Selected ({selectedIds.size})
                        </Button>
                    )}
                </div>

                {/* Products Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        {searchQuery ? 'No products match your search.' : 'No products yet. Add your first product!'}
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10 px-2">
                                        <Checkbox
                                            checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Article</TableHead>
                                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                                    <TableHead className="hidden md:table-cell">GSM</TableHead>
                                    <TableHead className="hidden lg:table-cell">Price</TableHead>
                                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    <TableHead className="w-20 text-right pr-2">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="px-2">
                                            <Checkbox
                                                checked={selectedIds.has(product.id)}
                                                onCheckedChange={() => toggleSelect(product.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="max-w-[140px] sm:max-w-[200px]">
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{product.article_name}</p>
                                                <p className="text-sm text-muted-foreground truncate sm:hidden">{product.category}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell capitalize">{product.category}</TableCell>
                                        <TableCell className="hidden md:table-cell">{product.gsm}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {formatPriceRange(product.price_min, product.price_max)}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <button onClick={() => handleToggleActive(product.id, product.is_active ?? true)}>
                                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right pr-2">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setProductToDelete(product.id);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {productToDelete
                                ? 'This will permanently delete this product and all its images.'
                                : `This will permanently delete ${selectedIds.size} selected products and all their images.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => productToDelete ? handleDelete(productToDelete) : handleBulkDelete()}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function AdminProductsPage() {
    return (
        <ProtectedRoute>
            <ProductsContent />
        </ProtectedRoute>
    );
}
