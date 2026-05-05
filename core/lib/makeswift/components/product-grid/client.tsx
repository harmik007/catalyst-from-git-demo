'use client';

import { ComponentPropsWithoutRef } from 'react';

import { ProductList, ProductListSkeleton } from '@/vibes/soul/sections/product-list';

import { useProducts } from '../../utils/use-products';

type MSProductGridProps = Omit<ComponentPropsWithoutRef<typeof ProductList>, 'products'> & {
  className: string;
  productIds: string;
  enableDragDrop: 'enabled' | 'disabled';
};

export function MSProductGrid({
  className,
  productIds,
  enableDragDrop,
  ...props
}: MSProductGridProps) {

  const ids = productIds.split(',').map(id => id.trim()).filter(id => id !== '');
  const { products: fetchedProducts, isLoading } = useProducts({
    collection: 'none',
    collectionLimit: 0,
    additionalProductIds: ids,
  });

  if (isLoading) {
    return <ProductListSkeleton className={className} />;
  }

  if (fetchedProducts == null || fetchedProducts.length === 0) {
    return <ProductListSkeleton className={className} />;
  }

  // For now, just return the products in their original order
  // Note: ProductList component doesn't support drag and drop functionality
  const orderedProducts = fetchedProducts.filter((product): product is NonNullable<typeof product> => product != null);

  return (
    <ProductList
      {...props}
      className={className}
      products={orderedProducts}
    />
  );
}
