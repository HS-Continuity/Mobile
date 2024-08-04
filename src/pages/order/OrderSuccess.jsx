import { FiChevronUp } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../../components/Layouts/BottomNav";
import maskDigits from "../../components/Order/MaskDigits";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  if (!orderData) {
    return <div>No order data available</div>;
  }

  const {
    recipientName,
    recipientAddress,
    recipientPhoneNumber,
    orderMemo,
    totalAmount,
    cardInfo,
    orderDetailId,
    regularDeliveryApplicationId,
  } = orderData;

  const formatPrice = price => price.toLocaleString() + "원";

  return (
    <>
      <div className='noScrollbar flex flex-col bg-gray-100'>
        <div className='flex items-center justify-center bg-gray-100 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
            <h1 className='mb-4 text-center text-2xl font-bold'>결제가 완료되었습니다.</h1>

            <p className='mb-6 text-center text-gray-600'>
              빠른 시일 내에
              <br />
              식품 배송이 시작될 예정이에요.
            </p>

            <div className='mb-6 border-b border-t border-gray-200 py-4'>
              <p className='font-semibold'>{recipientName}</p>
              <p className='text-sm text-gray-600'>
                {recipientAddress}
                <br />
                {orderMemo}
              </p>
              <p className='mt-2 text-sm text-gray-600'>{recipientPhoneNumber}</p>
            </div>

            <div className='mb-4 flex items-center justify-between'>
              <span className='font-semibold'>결제 금액은 {formatPrice(totalAmount)}이에요.</span>
              <FiChevronUp className='text-gray-400' />
            </div>

            <div className='mb-6 rounded-lg bg-gray-100 p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  {cardInfo.cardCompany} ({maskDigits(cardInfo.cardNumber)})
                </span>
                <span className='font-semibold'>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className='flex space-x-4'>
              <button
                className='btn flex-1 bg-white hover:bg-white'
                onClick={() => {
                  regularDeliveryApplicationId == 0
                    ? navigate(`/order-history/${orderDetailId}`)
                    : navigate(`/subscription-history/${regularDeliveryApplicationId}`);
                }}>
                주문상세보기
              </button>
              <button
                className='btn flex-1 bg-green-shine text-white hover:bg-green-shine'
                onClick={() => navigate("/")}>
                계속 쇼핑하기
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  );
};

export default OrderSuccess;
