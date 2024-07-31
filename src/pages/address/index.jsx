import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { fetchMemberAddresses, deleteAddress, setDefaultAddress } from "../../apis";
import AddressRegisterModal from "../../components/Order/AddressRegisterModal";
import AddressEditModal from "../../components/Order/AddressEditModal";
import useAuthStore from "../../stores/useAuthStore";
import AddressSkeleton from "../../components/Skeletons/AddressSkeleton";
import NoAddress from "./NoAddress";
import toast from "react-hot-toast";

const Address = () => {
  const { username } = useAuthStore();
  const memberId = username;

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
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

  if (isLoading) return <AddressSkeleton />;
  if (isError)
    return <div className='alert alert-error'>주소 정보를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className='container mx-auto p-4'>
      {addresses && addresses.length > 0 ? (
        addresses.map(address => (
          <div key={address.memberAddressId} className='mb-4 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='text-xl font-bold'>{address.addressName}</span>
                {address.isDefaultAddress === "ACTIVE" ? (
                  <span className='btn btn-xs ml-2 cursor-default bg-green-shine text-xs font-light text-white hover:bg-green-shine'>
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
        ))
      ) : (
        <NoAddress />
      )}
      <button
        onClick={() => setIsRegisterModalOpen(true)}
        className='btn mt-2 w-full bg-green-shine text-base text-white hover:bg-green-shine'>
        <FaPlus className='mr-2' /> 새 배송지 등록
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
  );
};

export default Address;
