'use client';

export const runtime = 'edge';

import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id as string;

    return <ProductForm productId={productId} />;
}
