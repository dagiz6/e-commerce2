// app/vendor/manageProduct/[id]/page.tsx
import SingleProductPage from "./SingleProductPage";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default function ManageProductPage({ params }: Props) {
  return <SingleProductPage productId={params.id} />;
}
