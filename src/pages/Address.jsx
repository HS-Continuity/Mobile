import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchMemberAddresses, deleteAddress, setDefaultAddress } from "../apis";
import AddAddressModal from "../components/Mypage/AddAddressModal";

const Address = () => {
  const memberId = 1; // 고정된 member_id
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses", memberId],
    queryFn: () => fetchMemberAddresses(memberId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["address", memberId]);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["address", memberId]);
    },
  });

  const handleDelete = id => {
    if (window.confirm("정말로 이 주소를 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSetDefault = id => {
    setDefaultMutation.mutate({ memberId, addressId: id });
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>오류가 발생했습니다.</div>;

  return (
    <div className='container mx-auto p-4'>
      {addresses &&
        addresses.map((address, index) => (
          <div key={address.id} className='mb-4 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <span className='mr-2 font-bold'>배송지 {index + 1}</span>
                {address.is_default_address && (
                  <span className='rounded bg-emerald-800 px-2 py-1 text-sm text-white'>
                    기본 배송지
                  </span>
                )}
              </div>
              <div>
                <button onClick={() => setIsModalOpen(true)} className='mr-2 text-blue-500'>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(address.id)} className='text-red-500'>
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className='mt-2'>{address.general_address}</p>
            <p>{address.detail_address}</p>
            {!address.is_default_address && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className='mt-2 text-sm text-gray-600 underline'>
                기본 배송지로 설정
              </button>
            )}
          </div>
        ))}
      <button
        onClick={() => setIsModalOpen(true)}
        className='mt-4 flex w-full items-center justify-center rounded bg-emerald-800 px-4 py-2 text-white'>
        <FaPlus className='mr-2' /> 새 배송지 추가
      </button>
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberId={memberId}
      />
    </div>
  );
};

export default Address;
