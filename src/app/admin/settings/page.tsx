'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut, Loader2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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
    });

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
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateSettings.mutateAsync(formData);
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Settings error:', error);
            toast.error('Failed to save settings');
        }
    };

    const handleSearchToggle = (checked: boolean) => {
        setFormData(prev => ({ ...prev, search_enabled: checked ? 'true' : 'false' }));
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
