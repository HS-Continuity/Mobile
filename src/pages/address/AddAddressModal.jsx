import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaTimes } from "react-icons/fa";
import DaumPostcode from "react-daum-postcode";
import { addAddress } from "../../apis";

const AddAddressModal = ({ isOpen, onClose, memberId }) => {
  const [generalAddress, setGeneralAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["address", memberId]);
      onClose();
    },
  });

  const handleComplete = data => {
    setGeneralAddress(data.address);
    setIsSearchOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    addAddressMutation.mutate({
      memberId,
      general_address: generalAddress,
      detail_address: detailAddress,
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-6'>
        <h2 className='mb-4 text-xl font-bold'>새 배송지 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>일반 주소</label>
            <div className='mt-1 flex rounded-md shadow-sm'>
              <input
                type='text'
                value={generalAddress}
                readOnly
                className='flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='주소 검색을 눌러주세요'
              />
              <button
                type='button'
                onClick={() => setIsSearchOpen(true)}
                className='inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500'>
                <FaSearch />
              </button>
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>상세 주소</label>
            <input
              type='text'
              value={detailAddress}
              onChange={e => setDetailAddress(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              placeholder='상세 주소를 입력해주세요'
            />
          </div>
          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              취소
            </button>
            <button
              type='submit'
              className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              추가
            </button>
          </div>
        </form>
        {isSearchOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='w-full max-w-lg rounded-lg bg-white p-4'>
              <div className='flex justify-end'>
                <button onClick={() => setIsSearchOpen(false)} className='text-gray-500'>
                  <FaTimes />
                </button>
              </div>
              <DaumPostcode onComplete={handleComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAddressModal;
