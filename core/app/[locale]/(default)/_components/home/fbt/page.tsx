import { getFBTProductsData } from './page-data';
import FBTClient from './fbt-client';

export default async function FBTPage() {
  const fbtProducts = await getFBTProductsData();

  return (
    <div className="p-6">
      <FBTClient data={fbtProducts} />
    </div>
  );
}