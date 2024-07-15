import { useEffect } from "react";
import { FaTruck } from "react-icons/fa";
import useOrderStore from "../stores/useOrderStore";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../apis";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const member_id = 1;
  const navigate = useNavigate();
  // const { setOrders } = useOrderStore();

  // const {
  //   data: orders,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["orders"],
  //   queryFn: () => fetchOrders(member_id),
  // });

  // useEffect(() => {
  //   if (orders) {
  //     setOrders(orders);
  //   }
  // }, [orders, setOrders]);

  // if (isLoading) {
  //   return (
  //     <div className='flex h-screen items-center justify-center'>
  //       <span className='loading loading-spinner loading-lg'></span>
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return <div className='alert alert-error'>Error loading orders</div>;
  // }

  // if (!orders || orders.length === 0) {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <div className='card-body items-center text-center'>
          <FaTruck className='mb-4 text-6xl text-primary' />
          <div className='badge badge-primary badge-lg absolute -right-2 -top-2'>0</div>
          <h2 className='card-title'>주문 내역이 없습니다.</h2>
          <div className='card-actions justify-end'>
            <button className='btn btn-primary' onClick={() => navigate("/")}>
              쇼핑 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // // }
  // return (
  // <div className='p-4'>
  //   <h1 className='mb-4 text-2xl font-bold'>주문 내역</h1>
  //   <div className='alert mb-4 shadow-lg'>
  //     <div>
  //       <div>
  //         <h3 className='font-bold'> *주문 날짜</h3>
  //         <div className='text-xs'>배송완료</div>
  //       </div>
  //     </div>
  //     <div className='flex-none'>
  //       <button className='btn btn-sm'>환불 신청</button>
  //       <button className='btn btn-primary btn-sm'>배송조회</button>
  //     </div>
  //   </div>
  // </div>
  // );
};
//   return (
//     <div className='p-4'>
//       <h1 className='mb-4 text-2xl font-bold'>주문 내역</h1>
//       {orders.map(order => (
//         <div key={order.id} className='alert mb-4 shadow-lg'>
//           <div>
//             <div>
//               <h3 className='font-bold'>{order.date} *주문 날짜</h3>
//               <div className='text-xs'>배송완료</div>
//             </div>
//           </div>
//           <div className='flex-none'>
//             <button className='btn btn-sm'>환불 신청</button>
//             <button className='btn btn-primary btn-sm'>배송조회</button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

export default OrderHistory;
