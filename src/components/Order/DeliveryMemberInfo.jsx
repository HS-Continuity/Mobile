const DeliveryMemberInfo = ({
  recipientName,
  recipientPhone,
  handleNameChange,
  handlePhoneChange,
}) => {
  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>받는 사람 정보</h2>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='font-medium text-gray-500'>이름</p>
          <input
            type='text'
            className='input w-full max-w-xs font-bold'
            value={recipientName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <p className='font-medium text-gray-500'>전화번호</p>
          <input
            type='tel'
            className='input w-full max-w-xs font-bold'
            value={recipientPhone}
            onChange={handlePhoneChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryMemberInfo;
