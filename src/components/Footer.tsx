'use client';

import Link from 'next/link';
import { useSiteSettings, getActiveCategories } from '@/hooks/useSiteSettings';

export function Footer() {
    const { data: settings } = useSiteSettings();
    const currentYear = new Date().getFullYear();
    const categories = getActiveCategories(settings);

    // Get data from admin settings with fallbacks
    const businessName = settings?.business_name || 'Tom White';
    const storeLocationName = settings?.store_location_name || 'Karol Bagh, New Delhi';
    const primaryPhone = settings?.whatsapp_primary?.slice(-10) || '9599965941';
    const secondaryPhone = settings?.whatsapp_secondary?.slice(-10) || '9582142143';
    const businessHours = settings?.business_hours || 'Mon - Sat: 10:00 AM - 8:00 PM';

    return (
        <footer className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="mb-4">
                            <img
                                src="/logo-light.png"
                                alt={`${businessName} - Premium Wholesale T-Shirts`}
                                className="h-12 w-auto"
                            />
                        </div>
                        <p className="text-sm text-primary-foreground/80">
                            Your trusted partner for wholesale T-shirts from {storeLocationName}.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            {categories.slice(0, 5).map((category) => (
                                <li key={category.slug}>
                                    <a
                                        href={`#products?category=${category.slug}`}
                                        className="hover:text-[oklch(var(--accent))] transition-colors"
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li>
                                <a href="#categories" className="hover:text-[oklch(var(--accent))] transition-colors">
                                    Browse Categories
                                </a>
                            </li>
                            <li>
                                <a href="#products" className="hover:text-[oklch(var(--accent))] transition-colors">
                                    View Products
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="hover:text-[oklch(var(--accent))] transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-[oklch(var(--accent))] transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-[oklch(var(--accent))] transition-colors">
                                    Admin Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li>📍 {storeLocationName}</li>
                            <li>📞 {primaryPhone}, {secondaryPhone}</li>
                            <li>⏰ {businessHours}</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
                    <p>© {currentYear} {businessName}. All rights reserved.</p>
                    <p className="mt-2">
                        Made with ❤️ in India | Wholesale T-Shirts
                    </p>
                </div>
            </div>
        </footer>
    );
}
