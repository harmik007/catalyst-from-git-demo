// import { Metadata } from 'next';

// import { locales } from '~/i18n/locales';
// import { getMakeswiftPageMetadata, Page as MakeswiftPage } from '~/lib/makeswift';
// import { getMetadataAlternates } from '~/lib/seo/canonical';

// interface Params {
//   locale: string;
// }

// interface Props {
//   params: Promise<Params>;
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { locale } = await params;
//   const metadata = await getMakeswiftPageMetadata({ path: '/', locale });

//   return {
//     ...(metadata?.title != null && { title: metadata.title }),
//     ...(metadata?.description != null && { description: metadata.description }),
//     alternates: await getMetadataAlternates({ path: '/', locale }),
//   };
// }

// export function generateStaticParams(): Params[] {
//   return locales.map((locale) => ({ locale }));
// }

// export default async function Home({ params }: Props) {
//   const { locale } = await params;

//   return <MakeswiftPage locale={locale} path="/" />;
// }


// app/[locale]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { locales } from '~/i18n/locales';
import { getMakeswiftPageMetadata, Page as MakeswiftPage } from '~/lib/makeswift';
import { getMetadataAlternates } from '~/lib/seo/canonical';
{/* custom components for home page */}
import CategoryProduct from './_components/home/category-products/category-product';
import { BestsellerProducts } from './_components/home/bestseller-products/bestseller-products';
import FBTSection from './_components/home/fbt/page';
{/* custom components for home page */}
interface Params {
  locale: string;
}

interface Props {
  params: Promise<Params>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await getMakeswiftPageMetadata({ path: '/', locale });

  return {
    ...(metadata?.title != null && { title: metadata.title }),
    ...(metadata?.description != null && { description: metadata.description }),
    alternates: await getMetadataAlternates({ path: '/', locale }),
  };
}

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      {/* Custom Section */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">
            Welcome to Our Store
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            Discover premium products and build your perfect shopping experience.
          </p>

          <Link
            href="/shop"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Makeswift Page Content */}
      <MakeswiftPage locale={locale} path="/" />
      <h1>Hello World</h1>
      {/* custom components for home page */}
      <BestsellerProducts />
      <CategoryProduct />
      <FBTSection />
      {/* custom components for home page */}
    </>
  );
}