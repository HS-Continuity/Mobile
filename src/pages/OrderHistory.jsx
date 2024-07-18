import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();

  const deliveries = [
    {
      date: "2024.05.11",
      day: "주문 날짜",
      status: "배송완료",
      deliveryDate: "5/13(월) 도착",
      store: "브랜드명 상품명",
      price: "10,200원",
      quantity: "1개",
      isCompleted: true,
    },
    {
      date: "2024.05.11",
      day: "주문 날짜",
      status: "배송완료",
      deliveryDate: "5/13(월) 도착",
      store: "브랜드명 상품명",
      price: "10,200원",
      quantity: "1개",
      isCompleted: false,
    },
    {
      date: "2024.05.11",
      day: "주문 날짜",
      status: "배송완료",
      deliveryDate: "5/13(월) 도착",
      store: "브랜드명 상품명",
      price: "10,200원",
      quantity: "1개",
      isCompleted: false,
    },
    {
      date: "2024.05.11",
      day: "주문 날짜",
      status: "배송완료",
      deliveryDate: "5/13(월) 도착",
      store: "브랜드명 상품명",
      price: "10,200원",
      quantity: "1개",
      isCompleted: false,
    },
  ];

  return (
    <div className='mb-20 space-y-4 p-4'>
      {deliveries.map((delivery, index) => (
        <div key={index} className='rounded-lg bg-white p-4 shadow'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='text-sm text-gray-500'>
              {delivery.date} <span className='mx-1'>•</span> {delivery.day}
            </div>
            <div className='text-sm font-semibold text-blue-500'>{delivery.status}</div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='h-16 w-16 rounded bg-gray-200'></div>
            <div className='flex-grow'>
              <div className='mb-1 text-sm'>{delivery.store}</div>
              <div className='text-xs text-gray-500'>
                {delivery.price} / {delivery.quantity}
              </div>
            </div>
            <Link to={"/reviewapply"}>
              <div className='mb-4 flex items-center justify-end'>
                {/* <div className='font-bold'>{delivery.deliveryDate}</div> */}
                <FiChevronRight className='text-gray-400' />
                <h4>리뷰 작성</h4>
              </div>
            </Link>
          </div>
          <div className='mt-4 flex justify-center'>
            {delivery.isCompleted ? (
              <div className='flex w-full space-x-2'>
                <button
                  className='btn btn-outline btn-sm flex-1'
                  onClick={() => navigate("/refundapply")}>
                  환불 신청
                </button>

                <button className='btn btn-primary btn-sm flex-1'>배송조회</button>
              </div>
            ) : (
              <button className='btn btn-primary btn-sm w-full'>배송조회</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
