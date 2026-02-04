'use client';

import { useRef, useState, useEffect } from 'react';
import { CategoryCard } from './CategoryCard';
import { useSiteSettings, isCategoryScrollable, getActiveCategories } from '@/hooks/useSiteSettings';

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
    const categories = getActiveCategories(settings);
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

    const handleCategoryClick = (categorySlug: string) => {
        // Toggle: if already selected, deselect; otherwise select
        onSelectCategory(selectedCategory === categorySlug ? null : categorySlug);

        // Smooth scroll to products section
        setTimeout(() => {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    if (categories.length === 0) {
        return null;
    }

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
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.slug}
                            slug={category.slug}
                            name={category.name}
                            iconUrl={`/icons/${category.icon}`}
                            count={categoryCounts[category.slug]}
                            isSelected={selectedCategory === category.slug}
                            onClick={() => handleCategoryClick(category.slug)}
                        />
                    ))}
                </div>

                {/* Mobile View - Conditional scrollable or grid */}
                {scrollableEnabled ? (
                    /* Scrollable horizontal view on mobile */
                    <div className="sm:hidden relative">
                        {/* Left gradient fade indicator */}
                        {canScrollLeft && (
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        )}

                        {/* Scrollable container */}
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {categories.map((category) => (
                                <CategoryCard
                                    key={category.slug}
                                    slug={category.slug}
                                    name={category.name}
                                    iconUrl={`/icons/${category.icon}`}
                                    count={categoryCounts[category.slug]}
                                    isSelected={selectedCategory === category.slug}
                                    onClick={() => handleCategoryClick(category.slug)}
                                    compact
                                />
                            ))}
                        </div>

                        {/* Right gradient fade indicator */}
                        {canScrollRight && (
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                        )}
                    </div>
                ) : (
                    /* Grid view on mobile (3 columns) */
                    <div className="sm:hidden grid grid-cols-3 gap-2">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.slug}
                                slug={category.slug}
                                name={category.name}
                                iconUrl={`/icons/${category.icon}`}
                                count={categoryCounts[category.slug]}
                                isSelected={selectedCategory === category.slug}
                                onClick={() => handleCategoryClick(category.slug)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
