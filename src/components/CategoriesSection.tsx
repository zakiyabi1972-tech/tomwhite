'use client';

import { CategoryCard } from './CategoryCard';
import type { ProductCategory } from '@/types/database';

const CATEGORIES: { id: ProductCategory; name: string }[] = [
    { id: 'plain', name: 'Plain' },
    { id: 'printed', name: 'Printed' },
    { id: 'embossed', name: 'Embossed' },
    { id: 'embroidered', name: 'Embroidered' },
    { id: 'collar', name: 'Collar/Polo' },
    { id: 'knitted', name: 'Knitted' },
    { id: 'silicon', name: 'Silicon' },
    { id: 'patch', name: 'Patch' },
    { id: 'downshoulder', name: 'Drop Shoulder' },
];

interface CategoriesSectionProps {
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    categoryCounts: Record<string, number>;
}

export function CategoriesSection({
    selectedCategory,
    onSelectCategory,
    categoryCounts,
}: CategoriesSectionProps) {

    const handleCategoryClick = (categoryId: string) => {
        // Toggle: if already selected, deselect; otherwise select
        onSelectCategory(selectedCategory === categoryId ? null : categoryId);

        // Smooth scroll to products section
        setTimeout(() => {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <section id="categories" className="py-12 sm:py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                        Browse by Category
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our wide range of wholesale T-shirt categories.
                        Click on any category to filter products.
                    </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-3">
                    {CATEGORIES.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category.id}
                            name={category.name}
                            count={categoryCounts[category.id]}
                            isSelected={selectedCategory === category.id}
                            onClick={() => handleCategoryClick(category.id)}
                        />
                    ))}
                </div>

                {selectedCategory && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => onSelectCategory(null)}
                            className="text-sm text-accent hover:underline"
                        >
                            Clear filter ×
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
