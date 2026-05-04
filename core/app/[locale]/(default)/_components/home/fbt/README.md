# Frequently Bought Together (FBT) - Multi-Product Add to Cart

## Overview

This FBT component allows customers to select multiple products with variants/options and add them all to their cart in a single action. It uses a form submit approach with BigCommerce's GraphQL API and includes comprehensive debugging capabilities.

## Features

✅ **Multi-Product Selection**: Select multiple products with checkboxes  
✅ **Product Options Support**: Dropdowns, swatches, radio buttons, text/number fields  
✅ **Form Submit Approach**: Uses Next.js Server Actions for secure cart operations  
✅ **BigCommerce Integration**: Full compatibility with BigCommerce Cart API & GraphQL  
✅ **Console Logging**: Detailed debugging information for cart payloads  
✅ **Stock Management**: Automatic handling of out-of-stock products  
✅ **Validation**: Client and server-side validation for required options  
✅ **Responsive Design**: Mobile-friendly UI with modern styling  

## Architecture

### Component Structure

```
fbt/
├── fbt-client.tsx      # Main React component (client-side)
├── fbt-cart-action.tsx  # Server action for cart operations
├── query.ts            # GraphQL query for product data
├── page-data.ts        # Data fetching function
├── page.tsx           # Page wrapper component
└── README.md          # This documentation
```

### Data Flow

1. **Product Data**: Fetched via GraphQL query (`query.ts`)
2. **Client State**: Managed in `fbt-client.tsx` with React hooks
3. **Form Submission**: Uses Next.js Server Actions (`fbt-cart-action.tsx`)
4. **Cart Operations**: BigCommerce GraphQL API mutations

## Implementation Details

### Form Data Structure

The form encodes multiple products using Stencil-compatible naming:

```
product_0_id=123
product_0_qty=1
product_0_option_112=456   // optionEntityId=112, optionValueEntityId=456
product_1_id=789
product_1_qty=1
product_1_option_113=457
...
```

### Console Logging

**Client-side debugging** (on form submit):
```javascript
console.log('🚀 FBT Submit Debug:', {
  selectedProducts: selected,
  selectedOptions: selectedOptions,
  productsData: [...],
  timestamp: new Date().toISOString()
});
```

**Server-side debugging** (in server action):
```javascript
console.log('🛒 FBT Cart Payload:', {
  rawFormData: Object.fromEntries(formData.entries()),
  parsedProducts: products,
  lineItems: lineItems,
  timestamp: new Date().toISOString()
});
```

### BigCommerce Integration

- **GraphQL Mutations**: Uses same mutations as native Catalyst PDP
- **Cart Management**: Handles both new cart creation and adding to existing carts
- **Error Handling**: Comprehensive error handling with cart expiration recovery
- **Cookie Management**: Secure cart ID storage with httpOnly cookies

## Usage

### Basic Implementation

```tsx
import FBTClient from './_components/home/fbt/fbt-client';
import { getFBTProductsData } from './_components/home/fbt/page-data';

export default async function HomePage() {
  const fbtData = await getFBTProductsData();
  
  return (
    <div>
      {/* Other page content */}
      <FBTClient data={fbtData} />
    </div>
  );
}
```

### Customization

#### Product IDs
Edit `page-data.ts` to customize which products appear:

```typescript
const productIds = [77, 80, 81, 86]; // Change these IDs
```

#### Styling
The component uses Tailwind CSS classes. Key classes:
- Container: `p-6 border rounded-lg`
- Buttons: `bg-blue-600 text-white px-4 py-2`
- Images: `w-20 h-20 object-cover border`
- Options: `bg-gray-50 border p-3 rounded`

## API Integration

### Required Environment Variables

```env
BIGCOMMERCE_STORE_HASH=your_store_hash
BIGCOMMERCE_CHANNEL_ID=1
BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN=your_token
```

### GraphQL Mutations Used

1. **Create Cart**: `mutation FBTCreateCart($input: CreateCartInput!)`
2. **Add Line Items**: `mutation FBTAddCartLineItems($input: AddCartLineItemsInput!)`

## Testing

### Console Output Examples

**Successful submission:**
```
🚀 FBT Submit Debug: {
  selectedProducts: [77, 80],
  selectedOptions: {77: {112: "456"}},
  productsData: [
    {id: 77, name: "Product A", price: "$29.99", options: 1},
    {id: 80, name: "Product B", price: "$19.99", options: 0}
  ],
  timestamp: "2026-03-30T10:45:00.000Z"
}

🛒 FBT Cart Payload: {
  rawFormData: {product_0_id: "77", product_0_qty: "1", ...},
  parsedProducts: [{productEntityId: 77, quantity: 1, optionSelections: [...]}],
  lineItems: [{productEntityId: 77, quantity: 1, selectedOptions: {...}}],
  timestamp: "2026-03-30T10:45:01.000Z"
}
```

## Troubleshooting

### Common Issues

1. **Products not adding to cart**: Check console for validation errors
2. **Missing options**: Ensure required options are selected before submit
3. **Cart errors**: Verify BigCommerce API credentials and permissions
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Mode

Enable detailed logging by checking browser console and server logs for the 🚀 and 🛒 prefixed messages.

## Production Considerations

- **Performance**: Component uses React.memo and efficient state management
- **Security**: Server Actions prevent XSS attacks on cart operations
- **SEO**: Server-side rendering ensures proper indexing
- **Accessibility**: Includes proper ARIA labels and keyboard navigation

## Future Enhancements

- Quantity selectors for each product
- Product quick-view modals
- Wishlist integration
- Analytics tracking for FBT interactions
- A/B testing for product combinations
