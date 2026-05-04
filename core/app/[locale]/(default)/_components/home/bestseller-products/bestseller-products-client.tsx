'use client';

import { useState, useRef, useEffect } from 'react';
import { getFormProps, useForm } from '@conform-to/react';
import { startTransition, useActionState } from 'react';
import { requestFormReset } from 'react-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';

import { toast } from '@/vibes/soul/primitives/toaster';
import { useEvents } from '~/components/analytics/events';
import { useRouter } from '~/i18n/routing';
import { addToCart } from './add-to-cart';

interface ProductImage {
  url: string;
  altText: string;
}

interface ProductPrices {
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
}

interface PriceRange {
  min: {
    value: number;
    currencyCode: string;
  };
  max: {
    value: number;
    currencyCode: string;
  };
}

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
    defaultImage?: ProductImage | null;
    images?: {
      edges: {
        node: ProductImage;
      }[] | null;
    };
    prices?: ProductPrices | null;
    priceRanges?: {
      priceRange: PriceRange;
    } | null;
  };
}

function ProductCard({ product, isSelected }: { product: BestSellingProductEdge; isSelected: boolean }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const events = useEvents();

  const [{ lastResult, successMessage }, formAction, pending] = useActionState(addToCart, {
    lastResult: null,
    successMessage: undefined,
  });

  const [form] = useForm({
    lastResult,
    onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(() => {
        requestFormReset(event.currentTarget);
        formAction(formData);

        events.onAddToCart?.(formData);
      });
    },
  });

  useEffect(() => {
    if (lastResult?.status === 'success') {
      toast.success(successMessage);

      // This is needed to refresh the Data Cache after the product has been added to the cart.
      // The cart id is not picked up after the first time the cart is created/updated.
      router.refresh();
    }
  }, [lastResult, successMessage, router]);

  useEffect(() => {
    if (form.errors) {
      form.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [form.errors]);
  
  const images = product.node.images?.edges || [];
  const currentImage = images[currentImageIndex]?.node || product.node.defaultImage;
  const hasMultipleImages = images.length > 1;
  const isOnSale = product.node.prices?.salePrice && 
                   product.node.prices.salePrice.value < (product.node.prices.price?.value || 0);

  const formatPrice = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  };

  const getPriceDisplay = (productNode: BestSellingProductEdge['node']) => {
    if (productNode.prices?.salePrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-red-600">
            {formatPrice(productNode.prices.salePrice.value, productNode.prices.salePrice.currencyCode)}
          </span>
          {productNode.prices.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(productNode.prices.price.value, productNode.prices.price.currencyCode)}
            </span>
          )}
        </div>
      );
    }
    
    if (productNode.prices?.price) {
      return (
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(productNode.prices.price.value, productNode.prices.price.currencyCode)}
        </span>
      );
    }
    
    if (productNode.priceRanges?.priceRange) {
      return (
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(productNode.priceRanges.priceRange.min.value, productNode.priceRanges.priceRange.min.currencyCode)} - {formatPrice(productNode.priceRanges.priceRange.max.value, productNode.priceRanges.priceRange.max.currencyCode)}
        </span>
      );
    }
    
    return <span className="text-gray-500">Price not available</span>;
  };

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', product.node.entityId);
  };

  return (
    <div className={`group relative rounded-lg border bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 ${
      isSelected ? 'ring-2 ring-blue-500 scale-105' : ''
    }`}>
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
          SALE
        </div>
      )}

      {/* Wishlist Button */}
      {/* <button
        onClick={handleWishlist}
        className="absolute top-2 left-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
      >
        <Heart 
          className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </button> */}

      {/* Image Slider */}
      <div className="relative h-64 overflow-hidden rounded-t-lg">
        {currentImage && (
          <img
            src={currentImage.url}
            alt={currentImage.altText || product.node.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Image Navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Thumbnail Strip */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.node.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.node.brand.name}
          </p>
        )}
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.node.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          {getPriceDisplay(product.node)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <form {...getFormProps(form)} action={formAction} className="flex-1">
            <input name="id" type="hidden" value={product.node.entityId} />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {pending ? 'Adding...' : 'Add to Cart'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function BestsellerProductsClient({ products }: { products: BestSellingProductEdge[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Limit to exactly 5 products
  const displayProducts = products.slice(0, 5);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300; // Adjust based on card width + gap
    const currentScroll = container.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Previous products"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Next products"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Product Slider */}
      <div className="overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
        >
          {displayProducts.map((product: BestSellingProductEdge, index) => (
            <div key={product.node.entityId} className="flex-shrink-0 w-80">
              <ProductCard product={product} isSelected={index === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {displayProducts.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  );
}
