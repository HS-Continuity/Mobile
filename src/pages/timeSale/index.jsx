import { useTimeSaleProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";

const Timesale = () => {
  return (
    <div className='container mx-auto p-1'>
      <ProductList useQueryHook={useTimeSaleProductsQuery} gridCols={1} />
    </div>
  );
};

export default Timesale;
