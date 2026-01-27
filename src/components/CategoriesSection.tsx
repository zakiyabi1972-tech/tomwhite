'use client';

import { useRef, useState, useEffect } from 'react';
import { CategoryCard } from './CategoryCard';
import { useSiteSettings, isCategoryScrollable } from '@/hooks/useSiteSettings';
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
    const { data: settings } = useSiteSettings();
    const scrollableEnabled = isCategoryScrollable(settings);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    // Track scroll position to show/hide gradient indicators
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Check initial state
            handleScroll();
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [scrollableEnabled]);

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

                {/* 
                    Desktop (sm+): Always show grid layout
                    Mobile (< sm): Show scrollable when enabled, otherwise grid
                */}

                {/* Desktop Grid - Always visible on sm+ screens */}
                <div className="hidden sm:grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-3">
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

                {/* Mobile Layout - Only visible on screens below sm */}
                <div className="sm:hidden">
                    {scrollableEnabled ? (
                        /* Mobile Scrollable Layout */
                        <div className="relative">
                            {/* Scroll Container */}
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2
                                           scroll-smooth snap-x snap-mandatory"
                            >
                                {CATEGORIES.map((category) => (
                                    <div key={category.id} className="snap-start flex-shrink-0">
                                        <CategoryCard
                                            category={category.id}
                                            name={category.name}
                                            count={categoryCounts[category.id]}
                                            isSelected={selectedCategory === category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            compact
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Left Fade Gradient - shows when can scroll left */}
                            {canScrollLeft && (
                                <div
                                    className="absolute left-0 top-0 bottom-2 w-8 
                                               bg-gradient-to-r from-background to-transparent 
                                               pointer-events-none z-10"
                                    aria-hidden="true"
                                />
                            )}

                            {/* Right Fade Gradient - shows when can scroll right */}
                            {canScrollRight && (
                                <div
                                    className="absolute right-0 top-0 bottom-2 w-8 
                                               bg-gradient-to-l from-background to-transparent 
                                               pointer-events-none z-10"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    ) : (
                        /* Mobile Grid Layout (Default) */
                        <div className="grid grid-cols-3 gap-2">
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
                    )}
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
