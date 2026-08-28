import ProductDetail from "@/components/travelproducts/product-detail";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;

  return (
    <main>
      <ProductDetail productId={productId} />
    </main>
  );
}
