import { useGeneralProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";

const General = () => {
  return (
    <div>
      <ProductList useQueryHook={useGeneralProductsQuery} gridCols={2} />
    </div>
  );
};

export default General;
