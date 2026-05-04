# Category Products Add to Cart

This folder contains the add-to-cart functionality for category products.

## Files

- `add-to-cart.tsx` - Server action for adding products to cart with support for:
  - Basic product addition
  - Product options (color, size, etc.)
  - Gift wrapping options
  - Quantity selection
  - Locale support
  - Error handling and success messages

- `category-client.tsx` - Client component that renders product cards with:
  - Product images and information
  - Product option selectors
  - Add to cart buttons
  - Loading states
  - Success/error message display

- `category-product.tsx` - Main page component
- `page-data.ts` - Data fetching utilities
- `query.ts` - GraphQL queries

## Features

### Enhanced Line Item Support

The add-to-cart functionality supports the following line item structure:

```json
{
  "lineItems": [
    {
      "quantity": 2,
      "productId": 230,
      "optionSelections": [
        {
          "optionId": 10,
          "optionValue": "Some Text Value"
        }
      ],
      "giftWrapping": {
        "wrapTogether": true,
        "wrapDetails": [
          {
            "id": 1,
            "message": "Happy Birthday"
          }
        ]
      }
    }
  ],
  "locale": "en"
}
```

### Product Options

- Automatically detects and displays product options
- Supports multiple choice options (color, size, etc.)
- Validates required options before adding to cart

### Success Messages

- Shows success messages when products are added to cart
- Includes cart link for easy navigation
- Handles error messages gracefully

## Usage

The component automatically handles:

1. **Product Display**: Shows product images, names, and prices
2. **Option Selection**: Renders dropdowns for product options
3. **Form Submission**: Handles add-to-cart form submission
4. **State Management**: Manages loading states and messages
5. **Error Handling**: Displays appropriate error messages

## Integration

The add-to-cart functionality integrates with:

- BigCommerce cart API via `addToOrCreateCart`
- Conform form validation
- Next.js internationalization
- Tailwind CSS for styling

## Error Handling

The system handles various error types:

- **Stock Errors**: Not enough inventory
- **Cart Errors**: Missing or invalid cart
- **Validation Errors**: Invalid form data
- **Network Errors**: API connectivity issues
