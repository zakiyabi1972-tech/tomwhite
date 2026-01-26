'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: settings } = useSiteSettings();

    // Extract phone number from whatsapp_primary (remove country code for display)
    const primaryPhone = settings?.whatsapp_primary?.slice(-10) || '9599965931';
    const businessName = settings?.business_name || 'Tom White';

    return (
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground py-2 px-4">
                <div className="container mx-auto flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Karol Bagh, New Delhi</span>
                        <span className="sm:hidden">New Delhi</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={`tel:${primaryPhone}`}
                            className="flex items-center gap-1 hover:text-accent transition-colors"
                        >
                            <Phone className="h-3 w-3" />
                            <span>{primaryPhone}</span>
                        </a>
                        <span className="text-primary-foreground/50">|</span>
                        <Link
                            href="/admin"
                            className="hover:text-accent transition-colors"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto py-2 sm:py-4 px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/logo-dark.png"
                            alt="Tom White - Premium Wholesale T-Shirts"
                            className="h-10 sm:h-12 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#categories" className="text-sm font-medium hover:text-accent transition-colors">
                            Categories
                        </a>
                        <a href="#products" className="text-sm font-medium hover:text-accent transition-colors">
                            Products
                        </a>
                        <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">
                            About Us
                        </a>
                        <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">
                            Contact
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 pt-4 border-t border-border animate-fade-in">
                        <div className="flex flex-col gap-2">
                            <a
                                href="#categories"
                                className="py-2 text-sm font-medium hover:text-accent transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </a>
                            <a
                                href="#products"
                                className="py-2 text-sm font-medium hover:text-accent transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </a>
                            <a
                                href="#about"
                                className="py-2 text-sm font-medium hover:text-accent transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About Us
                            </a>
                            <a
                                href="#contact"
                                className="py-2 text-sm font-medium hover:text-accent transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
