import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../apis";
import ReviewAllList from "../components/Product/ReviewAllList";

const ProductReviewAll = () => {
  const { productId } = useParams();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    return <div>No product data available.</div>;
  }

  return (
    <ReviewAllList productId={productId} productName={product.product_name || "Unknown Product"} />
  );
};

export default ProductReviewAll;
