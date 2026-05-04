'use server';

import { revalidatePath } from 'next/cache';
import { graphql } from '~/client/graphql';
import { client } from '~/client';
import { getCartId, setCartId, clearCartId } from '~/lib/cart';

// ─── GraphQL Mutations (same as Catalyst's native PDP) ───────────────────────

const CREATE_CART_MUTATION = graphql(`
  mutation FBTCreateCart($input: CreateCartInput!) {
    cart {
      createCart(input: $input) {
        cart {
          entityId
        }
      }
    }
  }
`);

const ADD_CART_LINE_ITEMS_MUTATION = graphql(`
  mutation FBTAddCartLineItems($input: AddCartLineItemsInput!) {
    cart {
      addCartLineItems(input: $input) {
        cart {
          entityId
        }
      }
    }
  }
`);

// ─── Types ────────────────────────────────────────────────────────────────────

interface OptionSelection {
  optionEntityId: number;
  optionValueEntityId: number;
}

interface ParsedProduct {
  productEntityId: number;
  quantity: number;
  optionSelections: OptionSelection[];
}

// ─── FormData Parser ──────────────────────────────────────────────────────────
//
// FBT form encodes multiple products like Stencil does:
//
//   product_0_id=123
//   product_0_qty=1
//   product_0_option_112=456   ← optionEntityId=112, optionValueEntityId=456
//   product_1_id=789
//   product_1_qty=1
//   ...

function parseFormData(formData: FormData): ParsedProduct[] {
  const products: ParsedProduct[] = [];
  const raw = Object.fromEntries(formData.entries());

  let index = 0;
  while (`product_${index}_id` in raw) {
    const productEntityId = Number(raw[`product_${index}_id`]);
    const quantity        = Number(raw[`product_${index}_qty`] ?? 1);

    // Collect all option keys for this product: product_N_option_<optionEntityId>
    const optionSelections: OptionSelection[] = [];
    const optionPrefix = `product_${index}_option_`;

    for (const [key, value] of Object.entries(raw)) {
      if (key.startsWith(optionPrefix)) {
        const optionEntityId      = Number(key.replace(optionPrefix, ''));
        const optionValueEntityId = Number(value);
        if (!isNaN(optionEntityId) && !isNaN(optionValueEntityId)) {
          optionSelections.push({ optionEntityId, optionValueEntityId });
        }
      }
    }

    products.push({ productEntityId, quantity, optionSelections });
    index++;
  }

  return products;
}

// ─── Build GraphQL lineItems input ────────────────────────────────────────────

function toLineItems(products: ParsedProduct[]) {
  return products.map(({ productEntityId, quantity, optionSelections }) => ({
    productEntityId,
    quantity,
    ...(optionSelections.length > 0
      ? { selectedOptions: { multipleChoices: optionSelections } }
      : {}),
  }));
}

// ─── Server Action (called by <form action={addFBTToCart}>) ──────────────────

export async function addFBTToCart(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  //  Use Catalyst's session-based cart system instead of cookies
  const cartId = await getCartId();

  // 🔍 DEBUG: Log environment and cart state
  console.log('🔧 FBT Environment Debug:', {
    hasStorefrontToken: !!process.env.BIGCOMMERCE_STOREFRONT_TOKEN,
    hasStoreHash: !!process.env.BIGCOMMERCE_STORE_HASH,
    hasChannelId: !!process.env.BIGCOMMERCE_CHANNEL_ID,
    hasImpersonationToken: !!process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN,
    cartId: cartId || 'none',
    timestamp: new Date().toISOString()
  });

  const products  = parseFormData(formData);
  const lineItems = toLineItems(products);

  // 🔍 DEBUG: Log cart payload for debugging
  console.log('🛒 FBT Cart Payload:', {
    rawFormData: Object.fromEntries(formData.entries()),
    parsedProducts: products,
    lineItems: lineItems,
    timestamp: new Date().toISOString()
  });

  if (lineItems.length === 0) {
    return { success: false, message: 'No products selected.' };
  }

  try {
    if (cartId) {
      // ── add to existing cart ───────────────────────────────────────────────
      const { data, errors } = await client.fetch({
        document: ADD_CART_LINE_ITEMS_MUTATION,
        variables: {
          input: {
            cartEntityId: cartId,
            data: { lineItems },
          },
        },
        fetchOptions: { cache: 'no-store' },
      });

      if (errors?.length) {
        // Log the full error structure for debugging
        console.log('🚨 GraphQL Errors:', JSON.stringify(errors, null, 2));
        
        // Check for cart does not exist error in multiple ways
        const cartDoesNotExist = errors.some((error: any) => 
          error.message?.includes('Cart does not exist') ||
          error.message?.includes('Not Found') ||
          error.path?.includes('addCartLineItems')
        );
        
        if (cartDoesNotExist) {
          console.log('🔄 Cart expired, creating new cart...');
          await clearCartId();
          return addFBTToCart(null, formData); // Retry by creating a new cart
        }
        throw new Error(errors.map((e: any) => e.message).join(', '));
      }

      const updatedId = data?.cart?.addCartLineItems?.cart?.entityId;

      if (!updatedId) {
        // Cart expired — clear session and retry as a new cart
        console.log('🔄 Cart returned no ID, creating new cart...');
        await clearCartId();
        return addFBTToCart(null, formData);
      }

    } else {
      // ── create new cart ────────────────────────────────────────────────────
      console.log('🛒 Creating new cart with items:', lineItems);
      const { data, errors } = await client.fetch({
        document: CREATE_CART_MUTATION,
        variables: { input: { lineItems } },
        fetchOptions: { cache: 'no-store' },
      });

      if (errors?.length) throw new Error(errors.map((e: any) => e.message).join(', '));

      const newCartId = data?.cart?.createCart?.cart?.entityId;

      if (!newCartId) throw new Error('Cart creation returned no entityId.');

      //  Use Catalyst's session-based cart storage
      await setCartId(newCartId);
      console.log(' New cart created with ID:', newCartId);
    }

    revalidatePath('/');
    return { success: true, message: 'Products added to cart!' };

  } catch (err: any) {
    console.error('[addFBTToCart]', err);
    
    // Check if it's a BigCommerce GraphQL error about cart not existing
    if (err.message?.includes('Cart does not exist') || 
        err.message?.includes('Not Found') ||
        (err.errors && err.errors.some((e: any) => e.path?.includes('addCartLineItems')))) {
      console.log('🔄 Cart error caught, creating new cart...');
      await clearCartId();
      return addFBTToCart(null, formData); // Retry by creating a new cart
    }
    
    return { success: false, message: err.message ?? 'Unknown error.' };
  }
}