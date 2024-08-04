import { useGeneralProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";
import GeneralFood from "../../assets/images/general_food.jpg";

const General = () => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <img
          src={GeneralFood}
          alt='general_food'
          className='h-96 w-full scale-105 object-cover blur-sm filter'
        />
        <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-white'>
          <h1 className='text-shadow-lg mb-4 text-4xl font-bold'>입맛대로 골라 담는 즐거움</h1>
          <p className='text-shadow-md text-xl'>신선함은 기본, 맛과 영양은 덤</p>
        </div>
      </div>
      <ProductList useQueryHook={useGeneralProductsQuery} gridCols={2} />
    </div>
  );
};

export default General;
