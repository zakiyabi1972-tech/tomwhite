import Link from 'next/link';
import { CATEGORIES } from '@/types/database';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="mb-4">
                            <img
                                src="/logo-light.png"
                                alt="Tom White - Premium Wholesale T-Shirts"
                                className="h-12 w-auto"
                            />
                        </div>
                        <p className="text-sm text-primary-foreground/80">
                            Your trusted partner for wholesale T-shirts from Karol Bagh, New Delhi.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-display font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            {CATEGORIES.slice(0, 5).map((category) => (
                                <li key={category.id}>
                                    <a
                                        href={`#products?category=${category.id}`}
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
                            <li>📍 Karol Bagh, New Delhi</li>
                            <li>📞 9599965931, 9582142143</li>
                            <li>⏰ Mon - Sat: 10AM - 8PM</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
                    <p>© {currentYear} Tom White. All rights reserved.</p>
                    <p className="mt-2">
                        Made with ❤️ in India | Wholesale T-Shirts
                    </p>
                </div>
            </div>
        </footer>
    );
}
