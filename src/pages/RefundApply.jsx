import React, { useState } from "react";

const RefundApply = () => {
  const [refundReason, setRefundReason] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    // 여기에 환불 신청 제출 로직을 추가합니다.
    console.log({ refundReason });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 rounded-lg bg-white p-4'>
      <div>
        <label htmlFor='refundReason' className='mb-2 block font-semibold'>
          환불 신청 사유
        </label>
        <input
          type='text'
          id='refundReason'
          value={refundReason}
          onChange={e => setRefundReason(e.target.value)}
          className='w-full rounded-lg border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          placeholder='환불 신청 사유를 입력해주세요'
          required
        />
      </div>

      <div className='flex justify-center space-x-2'>
        <button
          type='button'
          className='w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100'
          onClick={() => {
            /* 취소 로직 */
          }}>
          취소
        </button>
        <button
          type='submit'
          className='w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
          등록하기
        </button>
      </div>
    </form>
  );
};

export default RefundApply;
