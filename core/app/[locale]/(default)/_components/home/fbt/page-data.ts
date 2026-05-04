import { client } from '~/client';
import { GetFBTProductsQuery } from './query';

export async function getFBTProductsData() {
  const productIds = [77, 80, 81, 86]; //  dynamic array

  try {
    const response = await client.fetch({
      document: GetFBTProductsQuery,
      variables: {
        entityIds: productIds,
      },
    });

    console.log('FBT Products Response:', response);

    return response?.data?.site?.products?.edges || [];
  } catch (error) {
    console.error('FBT Error:', error);
    return [];
  }
}