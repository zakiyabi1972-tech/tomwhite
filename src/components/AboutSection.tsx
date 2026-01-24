import { Building2, Award, Truck, Users } from 'lucide-react';

export function AboutSection() {
    const features = [
        {
            icon: Building2,
            title: 'Direct from Factory',
            description: 'We manufacture in-house, ensuring quality control and competitive pricing.',
        },
        {
            icon: Award,
            title: 'Premium Quality',
            description: 'All fabrics are carefully sourced and products undergo strict quality checks.',
        },
        {
            icon: Truck,
            title: 'Pan-India Delivery',
            description: 'We ship across India with reliable logistics partners.',
        },
        {
            icon: Users,
            title: '10+ Years Experience',
            description: 'Trusted by thousands of retailers and brands across India.',
        },
    ];

    return (
        <section id="about" className="py-12 sm:py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                        About Tom White
                    </h2>
                    <p className="text-muted-foreground">
                        Your trusted partner for wholesale T-shirts from Karol Bagh, New Delhi.
                        We specialize in providing high-quality fabrics at wholesale prices.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
