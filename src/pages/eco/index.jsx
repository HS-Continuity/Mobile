import { useEcoProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";

const Eco = () => {
  return (
    <div>
      <ProductList useQueryHook={useEcoProductsQuery} gridCols={2} />
    </div>
  );
};

export default Eco;
