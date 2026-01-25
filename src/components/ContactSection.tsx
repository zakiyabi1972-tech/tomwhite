'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function ContactSection() {
    const { data: settings } = useSiteSettings();

    // Extract phone numbers from WhatsApp format (with country code)
    const primaryPhone = settings?.whatsapp_primary?.slice(-10) || '9599965931';
    const secondaryPhone = settings?.whatsapp_secondary?.slice(-10) || '9582142143';
    const primaryWhatsApp = settings?.whatsapp_primary || '919599965931';
    const businessAddress = settings?.business_address || 'H-16/86 Gali No 4, Tank Road, Near Bhalle Wale, Karol Bagh, New Delhi - 110005';
    const businessEmail = settings?.business_email || 'contact@tomwhite.in';

    return (
        <section id="contact" className="py-12 sm:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                        Get In Touch
                    </h2>
                    <p className="text-muted-foreground">
                        Visit our showroom in Karol Bagh or contact us for bulk orders
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-display font-semibold text-lg mb-6">Contact Information</h3>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-sm text-muted-foreground">{businessAddress}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">
                                        Primary: {primaryPhone}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Secondary: {secondaryPhone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{businessEmail}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Business Hours</p>
                                    <p className="text-sm text-muted-foreground">Mon - Sat: 10:00 AM - 8:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
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
                                <a href={`tel:${primaryPhone}`}>
                                    Call Now
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="aspect-video sm:aspect-auto sm:h-full min-h-[300px] bg-muted flex items-center justify-center">
                            <div className="text-center p-6">
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    📍 Karol Bagh, New Delhi
                                </p>
                                <Button asChild className="mt-4" variant="outline" size="sm">
                                    <a
                                        href="https://maps.google.com/?q=Karol+Bagh+New+Delhi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View on Google Maps
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

