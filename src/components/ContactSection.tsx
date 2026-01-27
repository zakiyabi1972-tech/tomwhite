'use client';

import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function ContactSection() {
    const { data: settings } = useSiteSettings();

    // Extract data from settings with fallbacks
    const primaryPhone = settings?.whatsapp_primary?.slice(-10) || '9599965941';
    const secondaryPhone = settings?.whatsapp_secondary?.slice(-10) || '9582142143';
    const primaryWhatsApp = settings?.whatsapp_primary || '919599965941';
    const businessAddress = settings?.business_address || 'H-16/86 Gali No 4, Tank Road, Near Bhalle Wale, Karol Bagh, New Delhi - 110005';
    const businessEmail = settings?.business_email || 'contact@tomwhite.in';
    const businessHours = settings?.business_hours || 'Mon - Sat: 10:00 AM - 8:00 PM';
    const storeLocationName = settings?.store_location_name || 'Karol Bagh, New Delhi';
    const storeMapUrl = settings?.store_map_url || 'https://maps.google.com/?q=28.6519,77.1900';
    const googleMapsEmbedUrl = settings?.google_maps_embed_url || '';

    return (
        <section id="contact" className="py-12 sm:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                        Get In Touch
                    </h2>
                    <p className="text-muted-foreground">
                        Visit our showroom in {storeLocationName} or contact us for bulk orders
                    </p>
                </div>

                {/* Main Grid - responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">

                    {/* Contact Info Card */}
                    <div className="bg-card border border-border rounded-xl p-5 sm:p-6 order-2 lg:order-1">
                        <h3 className="font-display font-semibold text-lg mb-1">Contact Information</h3>
                        <p className="text-sm text-muted-foreground mb-5">
                            Visit our showroom for wholesale inquiries & bulk orders
                        </p>

                        <div className="space-y-4">
                            {/* Address */}
                            <div className="flex gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Address</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{businessAddress}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Phone</p>
                                    <div className="text-sm text-muted-foreground space-y-0.5">
                                        <a
                                            href={`tel:+91${primaryPhone}`}
                                            className="block hover:text-primary transition-colors"
                                        >
                                            Primary: {primaryPhone}
                                        </a>
                                        {secondaryPhone && (
                                            <a
                                                href={`tel:+91${secondaryPhone}`}
                                                className="block hover:text-primary transition-colors"
                                            >
                                                Secondary: {secondaryPhone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            {businessEmail && (
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm sm:text-base">Email</p>
                                        <a
                                            href={`mailto:${businessEmail}`}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                                        >
                                            {businessEmail}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Business Hours */}
                            <div className="flex gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Business Hours</p>
                                    <p className="text-sm text-muted-foreground">{businessHours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button
                                asChild
                                className="flex-1 bg-[oklch(var(--whatsapp))] hover:bg-[oklch(var(--whatsapp))]/90 text-white"
                            >
                                <a
                                    href={`https://wa.me/${primaryWhatsApp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1"
                            >
                                <a href={`tel:+91${primaryPhone}`}>
                                    Call Now
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden order-1 lg:order-2">
                        {googleMapsEmbedUrl ? (
                            /* Embedded Google Maps */
                            <div className="flex flex-col h-full">
                                <div className="relative w-full h-48 sm:h-64 lg:h-[calc(100%-60px)]">
                                    <iframe
                                        src={googleMapsEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Map of ${storeLocationName}`}
                                        className="absolute inset-0"
                                    />
                                </div>
                                <div className="p-4 border-t border-border bg-card">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <a
                                            href={storeMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="h-4 w-4" />
                                            Get Directions
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Fallback: Static card if no embed URL */
                            <div className="flex flex-col h-full min-h-[280px] sm:min-h-[320px]">
                                <div className="flex-1 bg-muted/50 flex items-center justify-center p-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MapPin className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="text-lg font-medium mb-1">📍 {storeLocationName}</p>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            {businessAddress}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-border">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <a
                                            href={storeMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="h-4 w-4" />
                                            View on Google Maps
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
