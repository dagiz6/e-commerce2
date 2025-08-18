// app/vendor/manageProduct/[id]/page.tsx
import SingleProductPage from "./SingleProductPage";

export default function Page({ params }: { params: { id: string } }) {
  // params.id will always be available, even without generateStaticParams
  return <SingleProductPage productId={params.id} />;
}
