import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-sm'>
      <FaShoppingCart className='mb-4 text-6xl text-gray-300' />
      <h2 className='mb-2 text-2xl font-semibold text-gray-700'>장바구니가 비어있습니다</h2>
      <p className='mb-6 text-center text-gray-500'>상품을 추가하고 즐거운 쇼핑을 시작하세요!</p>
      <Link
        to='/'
        className='btn bg-green-shine text-white transition duration-300 hover:bg-green-shine'>
        쇼핑 계속하기
      </Link>
    </div>
  );
};

export default EmptyCart;
