// app/vendor/manageProduct/[id]/page.tsx
import SingleProductPage from "./SingleProductPage";

export const revalidate = 1; // ISR: re-generate page every 10 seconds

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/allProducts`
  );

  if (!res.ok) {
    console.error("Failed to fetch products for generateStaticParams");
    return [];
  }

  const data = await res.json();

  return data.products.map((p: any) => ({
    id: p._id.toString(),
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  // params.id is already resolved; pass it to your client component
  return <SingleProductPage productId={params.id} />;
}
