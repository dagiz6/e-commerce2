import SingleProductPage from "./SingleProductPage";

// Revalidate every hour (ISR)
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/allProducts`,
      { next: { revalidate: 3600 } } // Cache the fetch request too
    );
    
    if (!res.ok) throw new Error('Failed to fetch products');
    
    const data = await res.json();
    return data.products.map((p: any) => ({
      id: p._id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return empty array if fetch fails
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  // No need to await params - they're already resolved
  return <SingleProductPage productId={params.id} />;
}