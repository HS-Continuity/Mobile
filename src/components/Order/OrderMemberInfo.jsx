const OrderMemberInfo = ({ memberInfo }) => {
  return (
    <div className='bg-white p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>구매자 정보</h2>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='font-bold text-gray-800'>이름</p>
          <p className='font-medium text-gray-500'>{memberInfo.memberName}</p>
        </div>
        <div>
          <p className='font-bold text-gray-800'>전화번호</p>
          <p className='font-medium text-gray-500'>{memberInfo.memberPhoneNumber}</p>
        </div>
        {/* <div>
          <p className='font-medium text-gray-500'>이메일</p>
          <p className='font-bold text-gray-800'>{memberInfo.memberEmail}</p>
        </div> */}
      </div>
    </div>
  );
};

export default OrderMemberInfo;
