import { getCategoryProductsData } from './page-data';
import CategoryClient from './category-client';

export default async function CategoryProduct() {
  const category = await getCategoryProductsData();

  return (
    <div className="p-6">
      {/* <h1 className="text-xl font-bold mb-4">
        {category?.name || 'Test Page'}
      </h1> */}
    {/* <h1>category  </h1>
     
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
        {JSON.stringify(category, null, 2)}
      </pre> */}

      {/*  Browser console logging */}
      <CategoryClient data={category} />
    </div>
  );
}