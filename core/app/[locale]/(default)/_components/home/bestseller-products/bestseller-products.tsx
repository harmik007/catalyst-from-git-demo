import { Suspense } from 'react';
import { getBestSellingProducts } from './page-data';
import { BestsellerProductsClient } from './bestseller-products-client';

interface BestSellingProductEdge {
  node: {
    entityId: number;
    id: string;
    name: string;
    sku: string;
    path: string;
    brand?: {
      entityId: number;
      name: string;
    } | null;
    defaultImage?: {
      url: string;
      altText: string;
    } | null;
    images?: {
      edges: {
        node: {
          url: string;
          altText: string;
        };
      }[] | null;
    };
    prices?: {
      price?: {
        value: number;
        currencyCode: string;
      } | null;
      salePrice?: {
        value: number;
        currencyCode: string;
      } | null;
      basePrice?: {
        value: number;
        currencyCode: string;
      } | null;
      retailPrice?: {
        value: number;
        currencyCode: string;
      } | null;
    } | null;
    priceRanges?: {
      priceRange: {
        min: {
          value: number;
          currencyCode: string;
        };
        max: {
          value: number;
          currencyCode: string;
        };
      };
    } | null;
  };
}

interface BestSellingProductsData {
  site: {
    bestSellingProducts: {
      edges: BestSellingProductEdge[] | null;
    };
  };
}

async function BestsellerProductsContent() {
  const bestSellingProducts = await getBestSellingProducts();

  const products = bestSellingProducts?.site?.bestSellingProducts?.edges || [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bestseller Products</h2>
        <p className="text-gray-600">Discover our most popular products loved by customers</p>
      </div>
      
      {products.length > 0 ? (
        <BestsellerProductsClient products={products} />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">No bestseller products found</p>
            <p className="text-sm">Check back later for our trending items</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function BestsellerProducts() {
  return (
    <Suspense fallback={
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bestseller Products</h2>
          <p className="text-gray-600">Discover our most popular products loved by customers</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
          <div className="animate-pulse">
            <div className="flex gap-4 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-64">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    }>
      <BestsellerProductsContent />
    </Suspense>
  );
}