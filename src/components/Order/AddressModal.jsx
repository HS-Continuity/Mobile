import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaTimes } from "react-icons/fa";
import { fetchMemberAddresses, deleteAddress, setDefaultAddress } from "../../apis";
import AddressRegisterModal from "../../components/Order/AddressRegisterModal";
import AddressEditModal from "../../components/Order/AddressEditModal";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingIn(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimatingIn) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        className={`h-full w-full bg-white shadow-xl transition-all duration-300 ease-in-out sm:w-full md:w-full lg:w-[500px] xl:w-[500px] ${
          isAnimatingIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b p-4'>
            <h2 className='text-xl font-bold'>{title}</h2>
            <button onClick={handleClose} className='text-gray-500 hover:text-gray-700'>
              <FaTimes className='text-xl' />
            </button>
          </div>
          <div className='noScrollbar flex-grow overflow-y-auto p-4'>{children}</div>
        </div>
      </div>
    </div>
  );
};

const AddressModal = ({ isOpen, onClose, memberId, onSelectAddress }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
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
      queryClient.invalidateQueries(["addresses", memberId]);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: ({ memberAddressId, memberId }) => setDefaultAddress(memberAddressId, memberId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["addresses", memberId], oldData => {
        return oldData.map(address => ({
          ...address,
          isDefaultAddress:
            address.memberAddressId === variables.memberAddressId ? "ACTIVE" : "INACTIVE",
        }));
      });
    },
  });

  const handleDelete = memberAddressId => {
    if (window.confirm("정말로 이 주소를 삭제하시겠습니까?")) {
      deleteMutation.mutate(memberAddressId);
    }
  };

  const handleSetDefault = memberAddressId => {
    setDefaultMutation.mutate({ memberAddressId, memberId });
  };

  const handleEditClick = memberAddressId => {
    setEditingAddressId(memberAddressId);
    setIsEditModalOpen(true);
  };

  const handleSelectAddress = () => {
    const selectedAddress = addresses.find(
      address => address.memberAddressId === selectedAddressId
    );
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    }
  };

  if (isLoading) return <div className='flex h-screen items-center justify-center'>로딩 중...</div>;
  if (isError)
    return <div className='alert alert-error'>주소 정보를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='배송지 관리'>
      <div className='container mx-auto p-2'>
        {addresses &&
          addresses.map(address => (
            <div key={address.memberAddressId} className='mb-4 rounded-lg border p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    id={`address-${address.memberAddressId}`}
                    name='selectedAddress'
                    value={address.memberAddressId}
                    checked={selectedAddressId === address.memberAddressId}
                    onChange={() => setSelectedAddressId(address.memberAddressId)}
                    className='mr-2'
                  />
                  <label
                    htmlFor={`address-${address.memberAddressId}`}
                    className='text-xl font-bold'>
                    {address.addressName}
                  </label>
                  {address.isDefaultAddress === "ACTIVE" ? (
                    <span className='bg-green-shine btn btn-xs ml-2 cursor-default text-xs font-light text-white hover:bg-[#00835F]'>
                      기본배송지
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(address.memberAddressId)}
                      className='btn btn-xs ml-2 border border-gray-300 bg-white text-xs font-light hover:bg-white'>
                      기본배송지 설정
                    </button>
                  )}
                </div>
                <div>
                  <button
                    className='btn btn-xs border border-gray-300 bg-white text-sm hover:bg-white'
                    onClick={() => handleEditClick(address.memberAddressId)}>
                    수정
                  </button>
                  <button
                    className='btn btn-xs ml-2 border border-gray-300 bg-white text-sm hover:bg-white'
                    onClick={() => handleDelete(address.memberAddressId)}>
                    삭제
                  </button>
                </div>
              </div>
              <p className='mt-2'>{address.generalAddress}</p>
              <p>{address.detailAddress}</p>
              <p className='text-gray-500'>
                {address.recipientName} / {address.recipientPhoneNumber}
              </p>
            </div>
          ))}
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className='bg-green-shine btn w-full text-base text-white hover:bg-[#00835F]'>
          <FaPlus className='mr-2' /> 새 배송지 등록
        </button>
        <button
          onClick={handleSelectAddress}
          className='btn mt-2 w-full bg-blue-500 text-base text-white hover:bg-blue-600'
          disabled={!selectedAddressId}>
          선택하기
        </button>

        <AddressRegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          memberId={memberId}
        />

        <AddressEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          memberId={memberId}
          addressId={editingAddressId}
        />
      </div>
    </Modal>
  );
};

export default AddressModal;
