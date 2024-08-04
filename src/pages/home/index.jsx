import { useProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";
import ProductSlider from "./ProductSlider";
import CategoryGrid from "./CategoryGrid";
import AdvertisementProductList from "../../components/Product/AdvertisementProductList";

const Home = () => {
  return (
    <div>
      <ProductSlider />
      <CategoryGrid />
      <AdvertisementProductList />
      <ProductList useQueryHook={useProductsQuery} gridCols={1} />
    </div>
  );
};

export default Home;
