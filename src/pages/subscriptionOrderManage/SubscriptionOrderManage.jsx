import { FaSquare } from "react-icons/fa";

const subscriptionData = {
  period: "2024.06.04 - 2024.08.20 (3개월)",
  items: [
    { name: "첫번째 품목", description: "브랜드명 상품명", price: "10,200원", quantity: "1개" },
    { name: "두번째 품목", description: "브랜드명 상품명", price: "9,800원", quantity: "1개" },
    { name: "세번째 품목", description: "브랜드명 상품명", price: "14,500원", quantity: "1개" },
  ],
  deliveryInfo: {
    recipient: "김이박",
    phone: "010-0000-0000",
    address: "상세 주소",
    message: "문 앞에 놓고 가주세요",
  },
  subscriptionDetails: {
    frequency: "2주 간격",
    period: "2024.06.04 ~ 2024.08.20",
    startDay: "화요일",
  },
};

const SubscriptionOrderManage = () => {
  return (
    <div className='mx-auto mb-16 max-w-md space-y-4 p-2'>
      <h2 className='text-sm font-bold'>{subscriptionData.period}</h2>

      <div className='rounded-lg bg-white p-4 shadow'>
        <div className='mb-4 flex items-start space-x-4'>
          <div className='flex h-20 w-20 items-center justify-center bg-gray-200'>
            <FaSquare className='text-4xl text-gray-400' />
          </div>
          <div className='flex-1 space-y-2'>
            {subscriptionData.items.map((item, index) => (
              <div key={index} className='flex justify-between text-sm'>
                <div>{item.name}</div>
                <div>{item.description}</div>
                <div>
                  {item.price} {item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='rounded-lg bg-white p-4 shadow'>
        <h3 className='mb-2 font-bold'>배송정보</h3>
        <div className='space-y-2 text-sm'>
          <div className='flex'>
            <div className='w-24'>받는 분</div>
            <div>{subscriptionData.deliveryInfo.recipient}</div>
          </div>
          <div className='flex'>
            <div className='w-24'>전화번호</div>
            <div>{subscriptionData.deliveryInfo.phone}</div>
          </div>
          <div className='flex'>
            <div className='w-24'>배송지</div>
            <div>{subscriptionData.deliveryInfo.address}</div>
          </div>
          <div className='flex'>
            <div className='w-24'>배송메시지</div>
            <div>{subscriptionData.deliveryInfo.message}</div>
          </div>
        </div>
      </div>

      <div className='rounded-lg bg-white p-4 shadow'>
        <h3 className='mb-2 font-bold'>정기배송 주기</h3>
        <div className='space-y-2 text-sm'>
          <div className='flex'>
            <div className='w-24'>배송주기</div>
            <div>{subscriptionData.subscriptionDetails.frequency}</div>
          </div>
          <div className='flex'>
            <div className='w-24'>배송기간</div>
            <div>{subscriptionData.subscriptionDetails.period}</div>
          </div>
          <div className='flex'>
            <div className='w-24'>배송시작요일</div>
            <div>{subscriptionData.subscriptionDetails.startDay}</div>
          </div>
        </div>
      </div>

      <div className='flex justify-between'>
        <button className='btn btn-outline'>이번 배송 건너뛰기</button>
        <button className='btn btn-primary'>정기배송 취소하기</button>
      </div>
    </div>
  );
};

export default SubscriptionOrderManage;
