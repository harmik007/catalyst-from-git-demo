'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import { z } from 'zod';

import { Link } from '~/components/link';
import { addToOrCreateCart } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';
import { graphql } from '~/client/graphql';

type CartSelectedOptionsInput = ReturnType<typeof graphql.scalar<'CartSelectedOptionsInput'>>;

const formDataSchema = z.object({
  id: z.string(),
  quantity: z.string().optional(),
  optionSelections: z.string().optional(),
  giftWrapping: z.string().optional(),
  locale: z.string().optional(),
});

export interface State {
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}

export const addToCart = async (
  prevState: State,
  payload: FormData,
): Promise<{
  lastResult: SubmissionResult | null;
  successMessage?: ReactNode;
}> => {
  const t = await getTranslations('Compare');

  const submission = parseWithZod(payload, { schema: formDataSchema });

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() };
  }

  const productEntityId = Number(submission.value.id);
  const quantity = Number(submission.value.quantity) || 1;

  // Parse option selections if provided and convert to selectedOptions format
  let selectedOptions: CartSelectedOptionsInput = {};
  if (submission.value.optionSelections) {
    try {
      const optionSelections = JSON.parse(submission.value.optionSelections);
      console.log('optionSelections', optionSelections);
      
      // Convert to the correct selectedOptions format
      if (optionSelections.length > 0) {
        selectedOptions = {
          multipleChoices: optionSelections.map((selection: any) => ({
            optionEntityId: selection.optionId,
            optionValueEntityId: Number(selection.optionValue),
          })),
        };
      }
    } catch (error) {
      console.error('Error parsing option selections:', error);
    }
  }

  // Parse gift wrapping if provided
  let giftWrapping;
  if (submission.value.giftWrapping) {
    try {
      giftWrapping = JSON.parse(submission.value.giftWrapping);
    } catch (error) {
      console.error('Error parsing gift wrapping:', error);
    }
  }

  try {
    await addToOrCreateCart({
      lineItems: [
        {
          productEntityId,
          quantity,
          ...(Object.keys(selectedOptions).length > 0 && { selectedOptions }),
          ...(giftWrapping && { giftWrapping }),
        },
      ],
    });

    return {
      lastResult: submission.reply(),
      successMessage: t.rich('successMessage', {
        cartItems: quantity,
        cartLink: (chunks) => (
          <Link className="underline" href="/cart" prefetch="viewport" prefetchKind="full">
            {chunks}
          </Link>
        ),
      }),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof BigCommerceGQLError) {
      return {
        lastResult: submission.reply({
          formErrors: error.errors.map(({ message }) => {
            if (message.includes('Not enough stock:')) {
              // This removes the item id from the message. It's very brittle, but it's the only
              // solution to do it until our API returns a better error message.
              return message.replace('Not enough stock: ', '').replace(/\(\w.+\)\s/, '');
            }

            return message;
          }),
        }),
      };
    }

    if (error instanceof MissingCartError) {
      return {
        lastResult: submission.reply({ formErrors: [t('missingCart')] }),
      };
    }

    if (error instanceof Error) {
      return {
        lastResult: submission.reply({ formErrors: [error.message] }),
      };
    }

    return {
      lastResult: submission.reply({ formErrors: [t('unknownError')] }),
    };
  }
};
