import { cache } from 'react';

import { client } from '~/client';
import { revalidate } from '~/client/revalidate-target';
import { BestSellingProductsQuery } from './query';

export const getBestSellingProducts = cache(async () => {
  try {
    console.log('Fetching best selling products...');
    
    const response = await client.fetch({
      document: BestSellingProductsQuery,
      fetchOptions: { next: { revalidate } },
    });

    console.log('GraphQL response:', response);

    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
    }

    if (!response.data) {
      console.error('No data in GraphQL response');
      throw new Error('No data returned from GraphQL');
    }

    console.log('Best selling products data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    throw error;
  }
});
