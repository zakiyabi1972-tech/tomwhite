'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProductsSection } from '@/components/ProductsSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFAB } from '@/components/WhatsAppFAB';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useProducts, useCategoryCounts } from '@/hooks/useProducts';
import type { ProductCategory, ProductWithImages } from '@/types/database';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products = [], isLoading } = useProducts(selectedCategory);
  const { data: categoryCounts = {} } = useCategoryCounts();

  const handleOpenDetail = (product: ProductWithImages) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing product to allow exit animation
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CategoriesSection
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat as ProductCategory | null)}
        categoryCounts={categoryCounts}
      />
      <ProductsSection
        products={products}
        isLoading={isLoading}
        onOpenDetail={handleOpenDetail}
      />
      <AboutSection />
      <ContactSection />
      <Footer />
      <WhatsAppFAB />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
