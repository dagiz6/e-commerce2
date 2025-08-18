
import SingleProductPage from "./SingleProductPage";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params; // Await the params promise
  return <SingleProductPage productId={resolvedParams.id} />;
}
