import { useAddToCart } from "@/hooks/use-cart";

function AddToCartButton({ productId }: { productId: string }) {
  const addToCart = useAddToCart();

  return (
    <button
      onClick={() => addToCart.mutate([{ productId, quantity: 1 }])}
      disabled={addToCart.isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      {addToCart.isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
