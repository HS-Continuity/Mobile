import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { fetchMemberAddresses, deleteAddress, setDefaultAddress } from "../../apis";
import AddressRegisterModal from "../../components/Order/AddressRegisterModal";
import AddressEditModal from "../../components/Order/AddressEditModal";
import toast from "react-hot-toast";
import Modal from "../../pages/product/Modal";

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

  const handleAddressAdded = newAddress => {
    queryClient.setQueryData(["addresses", memberId], oldData => {
      return [...(oldData || []), newAddress];
    });
    setIsRegisterModalOpen(false);
    setSelectedAddressId(newAddress.memberAddressId);
  };

  const handleDelete = memberAddressId => {
    toast(
      t => (
        <span>
          배송지를 삭제하시겠습니까?
          <button
            className='btn ml-2 h-10 rounded bg-transparent px-2 py-1 text-black hover:bg-white'
            onClick={() => {
              deleteMutation.mutate(memberAddressId);
              toast.dismiss(t.id);
            }}>
            확인
          </button>
          <button
            className='btn ml-2 h-10 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-500'
            onClick={() => {
              toast.dismiss(t.id);
            }}>
            취소
          </button>
        </span>
      ),
      {
        duration: 2000,
      }
    );
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
                    <span className='btn btn-xs ml-2 cursor-default bg-green-shine text-xs font-light text-white hover:bg-[#00835F]'>
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
          className='btn w-full bg-green-shine text-base text-white hover:bg-green-shine'>
          <FaPlus className='mr-2' /> 새 배송지 등록
        </button>
        <button
          onClick={handleSelectAddress}
          className='btn mt-2 w-full bg-blue-500 bg-gradient-shine text-base text-white hover:bg-blue-600'
          disabled={!selectedAddressId}>
          선택하기
        </button>

        <AddressRegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          memberId={memberId}
          onAddressAdded={handleAddressAdded}
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
