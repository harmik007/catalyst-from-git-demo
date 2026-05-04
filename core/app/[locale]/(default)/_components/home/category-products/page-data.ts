import { client } from '~/client';
import { GetCategoryProductsQuery } from './query';

export async function getCategoryProductsData() {
  try {
    const { data } = await client.fetch({
      document: GetCategoryProductsQuery,
      variables: {
        categoryId: 38, //  change dynamically later
      },
    });

    //  Terminal log (SERVER)
    console.log('SERVER DATA:', JSON.stringify(data, null, 2));

    return data?.site?.category || null;
  } catch (error) {
    console.error('Error fetching category products:', error);
    return null;
  }
}