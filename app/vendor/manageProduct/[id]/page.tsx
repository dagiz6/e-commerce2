import SingleProductPage from "./SingleProductPage";

export const revalidate = 3600; // ISR: Revalidate every hour

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/allProducts`,
    { next: { revalidate: 3600 } } // Cache the fetch request
  );
  const data = await res.json();
  return data.products.map((p: any) => ({
    id: p._id.toString(),
  }));
}

// Corrected component - params is already resolved by Next.js
export default function Page({ params }: { params: { id: string } }) {
  return <SingleProductPage productId={params.id} />;
}
