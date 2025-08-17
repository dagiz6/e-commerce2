
import SingleProductPage from "./SingleProductPage";

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/allProducts`
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
