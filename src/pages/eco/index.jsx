import { useEcoProductsQuery } from "../../apis";
import ProductList from "../../components/Product/ProductList";
import EcoFood from "../../assets/images/eco_food.jpg";

const Eco = () => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <img
          src={EcoFood}
          alt='eco_food'
          className='h-96 w-full scale-105 object-cover blur-sm filter'
        />

        <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-white'>
          <h1 className='text-shadow-lg mb-4 text-4xl font-bold'>지구를 생각하는</h1>
          <h1 className='text-shadow-lg mb-4 text-4xl font-bold'>건강한 선택</h1>
          <p className='text-shadow-md text-xl'>깐깐한 기준으로 엄선된 품질</p>
        </div>
      </div>
      <ProductList useQueryHook={useEcoProductsQuery} gridCols={2} />
    </div>
  );
};

export default Eco;
