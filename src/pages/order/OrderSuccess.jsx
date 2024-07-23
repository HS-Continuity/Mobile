import { FaChevronLeft } from "react-icons/fa";
import { FiChevronUp } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../../components/Layouts/BottomNav";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='noScrollbar flex h-screen flex-col bg-gray-100'>
        {/* <div className='noScrollbar flex items-center bg-[#00835F] p-4 text-white'>
          <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
          <h1 className='text-xl font-bold'>결제 완료</h1>
        </div> */}
        <div className='flex items-center justify-center bg-gray-100 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
            <h1 className='mb-4 text-center text-2xl font-bold'>결제가 완료되었습니다.</h1>

            <p className='mb-6 text-center text-gray-600'>
              빠른 시일 내에
              <br />
              식품 배송이 시작될 예정이에요.
            </p>

            <div className='mb-6 border-b border-t border-gray-200 py-4'>
              <p className='font-semibold'>김이박</p>
              <p className='text-sm text-gray-600'>
                김이박의 상세주소 김이박의 상세주소
                <br />
                라이더님께 남길 말
              </p>
              <p className='mt-2 text-sm text-gray-600'>010-0000-0000</p>
            </div>

            <div className='mb-4 flex items-center justify-between'>
              <span className='font-semibold'>결제 금액은 8,500원이에요.</span>
              <FiChevronUp className='text-gray-400' />
            </div>

            <div className='mb-6 rounded-lg bg-gray-100 p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>현대카드 (0000-00**-****-****)</span>
                <span className='font-semibold'>8,500원</span>
              </div>
            </div>

            <div className='flex space-x-4'>
              <button className='btn btn-outline flex-1'>주문상세보기</button>
              <button className='btn btn-primary flex-1' onClick={() => navigate("/")}>
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

// import React from "react";
// import { FaChevronLeft } from "react-icons/fa";
// import { FiChevronUp } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import useOrderStore from "../stores/useOrderStore";
// import BottomNav from "../components/Layouts/BottomNav";

// const fetchOrderDetails = async orderId => {
//   const response = await axios.get(`/api/orders/${orderId}`);
//   return response.data;
// };

// const OrderSuccess = () => {
//   const navigate = useNavigate();
//   const { orderId, selectedCard } = useOrderStore();

//   const { data: orderDetails, isLoading, isError } = useQuery({
//     queryKey: ['orderDetails', orderId],
//     queryFn: () => fetchOrderDetails(orderId),
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading order details</div>;

//   const { member_name, member_general_address, member_detail_address, total_amount } = orderDetails;

//   return (
//     <div className='noScrollbar flex h-screen flex-col bg-gray-100'>
//       <div className='noScrollbar flex items-center bg-[#00835F] p-4 text-white'>
//         <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
//         <h1 className='text-xl font-bold'>결제 완료</h1>
//       </div>
//       <div className='flex items-center justify-center bg-gray-100 p-4'>
//         <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
//           <h1 className='mb-4 text-center text-2xl font-bold'>결제가 완료되었습니다.</h1>

//           <p className='mb-6 text-center text-gray-600'>
//             빠른 시일 내에<br />
//             식품 배송이 시작될 예정이에요.
//           </p>

//           <div className='mb-6 border-b border-t border-gray-200 py-4'>
//             <p className='font-semibold'>{member_name}</p>
//             <p className='text-sm text-gray-600'>
//               {member_general_address} {member_detail_address}<br />
//               라이더님께 남길 말
//             </p>
//             <p className='mt-2 text-sm text-gray-600'>{orderDetails.phone_number}</p>
//           </div>

//           <div className='mb-4 flex items-center justify-between'>
//             <span className='font-semibold'>결제 금액은 {total_amount.toLocaleString()}원이에요.</span>
//             <FiChevronUp className='text-gray-400' />
//           </div>

//           <div className='mb-6 rounded-lg bg-gray-100 p-3'>
//             <div className='flex items-center justify-between'>
//               <span className='text-sm text-gray-600'>{selectedCard.card_company} ({selectedCard.card_number})</span>
//               <span className='font-semibold'>{total_amount.toLocaleString()}원</span>
//             </div>
//           </div>

//           <div className='flex space-x-4'>
//             <button className='btn btn-outline flex-1'>주문상세보기</button>
//             <button className='btn btn-primary flex-1' onClick={() => navigate('/')}>계속 쇼핑하기</button>
//           </div>
//         </div>
//       </div>
//       <BottomNav />
//     </div>
//   );
// };

// export default OrderSuccess;
