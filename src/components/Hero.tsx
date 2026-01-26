'use client';

import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Hero() {
    const { data: settings } = useSiteSettings();
    const storeMapUrl = settings?.store_map_url || 'https://maps.google.com/?q=28.6519,77.1900';

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Dark Overlay for Better Text Contrast */}
            <div className="absolute inset-0 bg-black/20" />

            <div className="container mx-auto relative py-16 sm:py-24 lg:py-32 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 mb-6 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        <span className="text-sm font-medium">Wholesale T-Shirts from Karol Bagh</span>
                    </div>

                    {/* Heading */}
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                        Premium Quality
                        <span className="block text-accent">T-Shirts at Wholesale Prices</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Direct from manufacturer. Plain, Printed, Embroidered & more.
                        <br className="hidden sm:block" />
                        Minimum order 30-100 pieces. Quality guaranteed.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Button
                            size="lg"
                            asChild
                            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8"
                        >
                            <a
                                href={storeMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Visit Store
                            </a>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="w-full sm:w-auto border-white/40 bg-white/10 text-white hover:bg-white/20 text-base px-8"
                        >
                            <a href="#products">
                                Browse Catalog
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M0 48H1440V0C1440 0 1140 48 720 48C300 48 0 0 0 0V48Z" className="fill-background" />
                </svg>
            </div>
        </section>
    );
}

