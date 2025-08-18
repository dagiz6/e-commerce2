
import SingleProductPage from "./SingleProductPage";

export const revalidate = 3600;

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/allProducts`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data.products.map((p: any) => ({
    id: p._id.toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params; // Await the params promise
  return <SingleProductPage productId={resolvedParams.id} />;
}
