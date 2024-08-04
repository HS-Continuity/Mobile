import { useTimeSaleProductsQuery } from "../../apis";
import TimesaleList from "./timeSaleList";
import TimesaleImg from "../../assets/images/timesale.jpg";

const Timesale = () => {
  return (
    <div className='container mx-auto'>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <img
          src={TimesaleImg}
          alt='time_sale'
          className='h-96 w-full scale-105 object-cover blur-sm filter'
        />

        <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-white'>
          <h1 className='text-shadow-lg mb-4 text-4xl font-bold'>놓치면 후회할, 단 3시간</h1>
          <p className='text-shadow-md text-xl'>필요한 식품이 있다면 빠르게</p>
        </div>
      </div>
      <TimesaleList useQueryHook={useTimeSaleProductsQuery} gridCols={1} />
    </div>
  );
};

export default Timesale;
