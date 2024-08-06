const SubscriptionInfo = ({ subscriptionDetails }) => {
  return (
    <div className='rounded-lg border bg-white p-4'>
      <h2 className='mb-2 text-xl font-semibold'>정기 배송 정보</h2>
      <hr className='mb-3 border-gray-200' />
      <div className='space-y-1'>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>배송주기</span>
          <span>{subscriptionDetails.deliveryCycle}</span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>배송기간</span>
          <span>
            {subscriptionDetails.startDate} ~ {subscriptionDetails.endDate}
          </span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>구독기간</span>
          <span>{subscriptionDetails.duration}</span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>배송요일</span>
          <span>{subscriptionDetails.deliveryDayOfWeeks.join(", ")}</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
