const OrderMemberInfo = ({ memberInfo }) => {
  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>구매자 정보</h2>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='font-medium text-gray-500'>이름</p>
          <p className='font-bold text-gray-800'>{memberInfo.member_name}</p>
        </div>
        <div>
          <p className='font-medium text-gray-500'>전화번호</p>
          <p className='font-bold text-gray-800'>{memberInfo.member_phone_number}</p>
        </div>
        <div>
          <p className='font-medium text-gray-500'>이메일</p>
          <p className='font-bold text-gray-800'>{memberInfo.member_email}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderMemberInfo;
