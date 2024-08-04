const OrderMemberInfo = ({ memberInfo }) => {
  return (
    <div className='rounded-lg border bg-white p-4'>
      <h2 className='mb-2 text-xl font-semibold'>구매자 정보</h2>
      <hr className='mb-3 border-gray-200' />
      <div className='space-y-1'>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>이름</span>
          <span>{memberInfo.memberName}</span>
        </div>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>전화번호</span>
          <span>{memberInfo.memberPhoneNumber}</span>
        </div>
        {memberInfo.memberEmail && (
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>이메일</span>
            <span>{memberInfo.memberEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderMemberInfo;
