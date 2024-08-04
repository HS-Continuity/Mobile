import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductDetail } from "../../apis";
import ReviewAllList from "../../components/Product/ReviewAllList";
import { ProductDetailError } from "../../components/Errors/ErrorDisplay";
import ProductDetailSkeleton from "../../components/Skeletons/ProductDetailSkeleton";

const ProductReviewAll = () => {
  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetail(productId),
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError) return <ProductDetailError />;

  return (
    product && (
      <ReviewAllList
        productId={productId}
        productName={product.productName || "올바른 상품이 아닙니다."}
      />
    )
  );
};

export default ProductReviewAll;
