import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { createSubscriptionOrder } from "../apis/index";
import { useSubscriptionSetupStore } from "../stores/useSubscriptionSetupStore";
import useCheckSubscriptionDetails from "../hooks/useCheckSubscriptionDetails";
import useOrderItemsValidation from "../hooks/useOrderItemsValidation";

const SubscriptionOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderItems } = location.state || { orderItems: [] };
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [consentPayment, setConsentPayment] = useState(false);
  const { subscriptionDetails } = useSubscriptionSetupStore();

  useCheckSubscriptionDetails(subscriptionDetails);
  useOrderItemsValidation(orderItems);

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 2500;
  const regularShippingDiscount = -2500;
  const finalPrice = totalPrice + shippingFee + regularShippingDiscount;

  const createOrderMutation = useMutation({
    mutationFn: createSubscriptionOrder,
    onSuccess: data => {
      navigate("/order-complete", { state: { orderId: data.id } });
    },
  });

  const handleConsentPayment = () => {
    setConsentPayment(!consentPayment);
  };

  const handleSubmit = () => {
    const orderData = {
      items: orderItems,
      subscriptionDetails,
      totalPrice: finalPrice,
      paymentMethod,
    };
    createOrderMutation.mutate(orderData);
  };

  return (
    <div className='noScrollbar flex h-screen flex-col bg-gray-100'>
      <div className='flex items-center bg-[#00835F] p-4 text-white'>
        <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
        <h1 className='text-xl font-bold'>정기 배송 결제</h1>
      </div>

      <div className='noScrollbar flex-1 overflow-auto p-4'>
        <div className='mb-4 rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 font-bold'>주문 상품</h2>
          {orderItems.map((item, index) => (
            <div key={index} className='mb-2 flex items-center'>
              <img
                src={item.image}
                alt={item.name}
                className='mr-2 h-12 w-12 rounded object-cover'
              />
              <div>
                <p className='font-semibold'>{item.name}</p>
                <p className='text-sm text-gray-600'>{item.quantity}개</p>
              </div>
            </div>
          ))}
        </div>

        <div className='mb-4 rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 font-bold'>정기 배송 정보</h2>
          <p>배송주기: {subscriptionDetails.frequency}</p>
          <p>배송기간: {subscriptionDetails.duration}</p>
          <p>배송요일: {subscriptionDetails.selectedDays.join(", ")}</p>
        </div>

        <div className='mb-4 rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 font-bold'>결제 금액</h2>
          <div className='flex justify-between'>
            <span>총 상품 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className='flex justify-between'>
            <span>배송비</span>
            <span>{shippingFee.toLocaleString()}원</span>
          </div>
          <div className='flex justify-between text-blue-600'>
            <span>정기 배송비 할인</span>
            <span>{regularShippingDiscount.toLocaleString()}원</span>
          </div>
          <div className='mt-2 flex justify-between font-bold'>
            <span>총 결제금액</span>
            <span>{finalPrice.toLocaleString()}원</span>
          </div>
        </div>

        <div className='mb-4 rounded-lg bg-white p-4 shadow'>
          <h2 className='mb-2 font-bold'>결제 수단</h2>
          <select
            className='select select-bordered w-full'
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}>
            <option value='card'>신용카드</option>
            <option value='bank'>계좌이체</option>
            <option value='phone'>휴대폰 결제</option>
          </select>
        </div>
      </div>

      <div className='p-4'>
        <label className='flex items-center'>
          <input
            type='checkbox'
            className='checkbox-primary checkbox mr-2'
            onClick={handleConsentPayment}
          />
          <span className='text-sm'>위 내용을 확인하였으며 결제에 동의합니다.</span>
        </label>
      </div>

      <button
        className={`bg-[#00835F] p-4 text-lg font-bold text-white ${!consentPayment ? "bg-gray-400" : ""}`}
        onClick={handleSubmit}
        disabled={!consentPayment || createOrderMutation.isLoading}>
        {createOrderMutation.isLoading ? "처리 중..." : "정기 배송 신청하기"}
      </button>
    </div>
  );
};

export default SubscriptionOrder;
