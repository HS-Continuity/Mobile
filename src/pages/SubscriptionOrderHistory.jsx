import { FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SubscriptionOrderHistory = () => {
  const navigate = useNavigate();
  const subscriptions = [
    {
      id: 1,
      period: "2024.06.04 - 2024.08.20",
      duration: "3개월",
      status: "정기주문 진행중",
      productName: "브랜드명 상품명",
      quantity: 2,
    },
    {
      id: 2,
      period: "2024.01.01 - 2024.01.22",
      duration: "1개월",
      status: "정기주문 완료",
      productName: "브랜드명 상품명",
      quantity: 2,
    },
  ];

  return (
    <div className='p-2'>
      {/* 날짜 선택 */}
      <div className='mb-4 flex items-center space-x-2'>
        <input type='date' className='input input-bordered' defaultValue='2023-12-28' />
        <span>~</span>
        <input type='date' className='input input-bordered' defaultValue='2024-02-28' />
        <button className='btn btn-outline btn-sm'>조회</button>
      </div>

      {/* 구독 목록 */}
      {subscriptions.map(sub => (
        <div key={sub.id} className='mb-4 rounded-lg bg-white p-4 shadow-md'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='text-sm text-gray-500'>
              {sub.period} ({sub.duration})
            </div>
            <button
              className='btn btn-ghost btn-xs'
              onClick={() => navigate("/subscription-manage")}>
              상세보기
            </button>
          </div>
          <div className='mb-2 flex items-center space-x-2'>
            <div
              className={`badge ${sub.status === "정기주문 진행중" ? "badge-primary" : "badge-ghost"}`}>
              {sub.status}
            </div>
          </div>
          <div className='flex items-center'>
            <div className='mr-4 h-16 w-16 rounded-md bg-gray-200'></div>
            <div>
              <div className='font-semibold'>{sub.productName}</div>
              <div className='text-sm text-gray-500'>외 {sub.quantity}건</div>
            </div>
          </div>
        </div>
      ))}

      {/* 달력 아이콘 */}
      <button className='btn btn-circle btn-lg fixed bottom-4 right-4 bg-primary text-white'>
        <FaCalendar className='text-2xl' />
      </button>
    </div>
  );
};

export default SubscriptionOrderHistory;
