'use client';

import Link from 'next/link';
import { Package, Plus, Settings, LogOut, ArrowLeft, LayoutDashboard, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminProducts } from '@/hooks/useProducts';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';

function DashboardContent() {
    const { user, signOut } = useAuth();
    const { data: products = [], isLoading } = useAdminProducts();

    const stats = {
        total: products.length,
        active: products.filter(p => p.is_active).length,
        categories: [...new Set(products.map(p => p.category))].length,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto py-4 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <span className="font-display font-semibold">Admin Panel</span>
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
                {/* Page Title */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                            <LayoutDashboard className="h-8 w-8" />
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your product catalog
                        </p>
                    </div>
                    <Link href="/admin/products/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Products</p>
                                <p className="text-3xl font-display font-bold mt-1">
                                    {isLoading ? '...' : stats.total}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Products</p>
                                <p className="text-3xl font-display font-bold mt-1">
                                    {isLoading ? '...' : stats.active}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-whatsapp/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-whatsapp" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Categories</p>
                                <p className="text-3xl font-display font-bold mt-1">
                                    {isLoading ? '...' : stats.categories}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                <LayoutDashboard className="h-6 w-6 text-accent" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-display font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/products">
                            <div className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                                <Package className="h-6 w-6 text-primary mb-2" />
                                <h3 className="font-semibold">View All Products</h3>
                                <p className="text-sm text-muted-foreground">Manage your product catalog</p>
                            </div>
                        </Link>
                        <Link href="/admin/products/new">
                            <div className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                                <Plus className="h-6 w-6 text-primary mb-2" />
                                <h3 className="font-semibold">Add New Product</h3>
                                <p className="text-sm text-muted-foreground">Create a new product entry</p>
                            </div>
                        </Link>
                        <Link href="/admin/settings">
                            <div className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                                <Settings className="h-6 w-6 text-primary mb-2" />
                                <h3 className="font-semibold">Settings</h3>
                                <p className="text-sm text-muted-foreground">Manage WhatsApp & business info</p>
                            </div>
                        </Link>
                        <Link href="/">
                            <div className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                                <ArrowLeft className="h-6 w-6 text-primary mb-2" />
                                <h3 className="font-semibold">View Catalog</h3>
                                <p className="text-sm text-muted-foreground">See the public-facing website</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Products */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-display font-semibold mb-4">Recent Products</h2>
                    {products.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No products yet. Add your first product to get started!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {products.slice(0, 5).map((product) => (
                                <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium">{product.article_name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded ${product.is_active ? 'bg-whatsapp/20 text-whatsapp' : 'bg-muted text-muted-foreground'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
