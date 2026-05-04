'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  path: string;
  defaultImage?: {
    url: string;
  };
}

interface MSProductGridProps {
  productIds?: string; // comma-separated
}

export function MSProductGrid({ productIds }: MSProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!productIds) return;

    const ids = productIds.split(',').map(id => id.trim());

    async function fetchProducts() {
      const res = await fetch('/api/products-by-ids', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      setProducts(data.products);
    }

    fetchProducts();
  }, [productIds]);

  if (!products.length) {
    return <div>No products found</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <a key={product.id} href={product.path} className="border p-4">
          <img src={product.defaultImage?.url} alt={product.name} />
          <h3 className="mt-2">{product.name}</h3>
        </a>
      ))}
    </div>
  );
}