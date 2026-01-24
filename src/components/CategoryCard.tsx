'use client';

import { cn } from '@/lib/utils';

interface CategoryCardProps {
    icon: string;
    name: string;
    count?: number;
    isSelected: boolean;
    onClick: () => void;
}

export function CategoryCard({ icon, name, count, isSelected, onClick }: CategoryCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center p-4 sm:p-6 rounded-xl border transition-all duration-200",
                "hover:shadow-hover hover:border-accent/50 hover:-translate-y-1",
                isSelected
                    ? "bg-accent/10 border-accent shadow-md"
                    : "bg-card border-border shadow-card"
            )}
        >
            <span className="text-2xl sm:text-3xl mb-2">{icon}</span>
            <h3 className="font-display font-semibold text-sm sm:text-base text-center mb-1">
                {name}
            </h3>
            {count !== undefined && count > 0 && (
                <p className="text-xs text-muted-foreground">{count} items</p>
            )}
        </button>
    );
}
