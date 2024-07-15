import { FaChevronLeft, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/Layouts/BottomNav";

const OrderFail = () => {
  const navigate = useNavigate();

  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-100'>
      <div className='noScrollbar flex items-center bg-[#00835F] p-4 text-white'>
        <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
        <h1 className='text-xl font-bold'>결제 실패</h1>
      </div>
      <div className='flex-2 flex items-center justify-center bg-gray-100 p-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-4 shadow-md'>
          <div className='mb-3 flex justify-center'>
            <FaExclamationTriangle className='text-6xl text-red-500' />
          </div>
          <h1 className='mb-4 text-center text-2xl font-bold text-red-500'>결제에 실패했습니다</h1>

          <p className='mb-6 text-center text-gray-600'>
            죄송합니다. 결제 처리 중 문제가 발생했습니다.
            <br />
            다시 시도해 주시거나 다른 결제 수단을 이용해 주세요.
          </p>

          <div className='mb-6 rounded-lg bg-gray-100 p-4'>
            <h2 className='mb-2 font-semibold'>가능한 원인:</h2>
            <ul className='list-inside list-disc text-sm text-gray-600'>
              <li>카드 잔액 부족</li>
              <li>카드 정보 오류</li>
              <li>일시적인 시스템 오류</li>
            </ul>
          </div>

          <div className='flex space-x-4'>
            <button className='btn btn-outline flex-1' onClick={() => navigate("/order")}>
              다시 시도하기
            </button>
            <button className='btn btn-primary flex-1' onClick={() => navigate("/")}>
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderFail;
