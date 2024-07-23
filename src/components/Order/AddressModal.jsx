import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DaumPostcode from "react-daum-postcode";
import {
  fetchMemberAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../apis";

const AddressModal = ({ isOpen, onClose, memberId }) => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    general_address: "",
    detail_address: "",
  });
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses", memberId],
    queryFn: () => fetchMemberAddresses(memberId),
  });

  const addAddressMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", memberId] });
      setNewAddress({ general_address: "", detail_address: "" });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", memberId] });
      setEditingAddress(null);
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", memberId] });
    },
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", memberId] });
    },
  });

  const handleAddAddress = () => {
    if (addresses && addresses.length >= 5) {
      alert("주소는 최대 5개까지만 저장할 수 있습니다.");
      return;
    }
    if (!newAddress.general_address) {
      alert("주소를 검색해주세요.");
      return;
    }
    addAddressMutation.mutate({
      memberId,
      general_address: newAddress.general_address.trim(),
      detail_address: newAddress.detail_address.trim(),
    });
  };

  const handleUpdateAddress = id => {
    updateAddressMutation.mutate({
      id,
      general_address: editingAddress.general_address.trim(),
      detail_address: editingAddress.detail_address.trim(),
      is_default_address: editingAddress.is_default_address,
    });
  };

  const handleDeleteAddress = id => {
    deleteAddressMutation.mutate(id);
  };

  const handleSetDefaultAddress = id => {
    setDefaultAddressMutation.mutate({ memberId, addressId: id });
  };

  const handleComplete = data => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    if (editingAddress) {
      setEditingAddress(prev => ({
        ...prev,
        general_address: fullAddress,
      }));
    } else {
      setNewAddress(prev => ({
        ...prev,
        general_address: fullAddress,
      }));
    }
    setIsAddressSearchOpen(false);
  };

  if (!isOpen) return null;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading addresses</div>;

  return (
    <div className='fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-5'>
        <h2 className='mb-4 text-xl font-bold'>배송지 관리</h2>
        <div className='space-y-4'>
          {addresses &&
            addresses.map(address => (
              <div key={address.id} className='relative rounded-lg border p-4'>
                {editingAddress && editingAddress.id === address.id ? (
                  <div className='space-y-2'>
                    <div className='flex'>
                      <input
                        type='text'
                        value={editingAddress.general_address}
                        readOnly
                        className='w-full rounded border p-2'
                        placeholder='주소'
                      />
                      <button
                        onClick={() => setIsAddressSearchOpen(true)}
                        className='ml-2 rounded bg-gray-200 p-2'>
                        <FaSearch />
                      </button>
                    </div>
                    <input
                      type='text'
                      value={editingAddress.detail_address}
                      onChange={e =>
                        setEditingAddress({ ...editingAddress, detail_address: e.target.value })
                      }
                      className='w-full rounded border p-2'
                      placeholder='상세주소'
                    />
                    <div className='flex justify-end space-x-2'>
                      <button
                        onClick={() => handleUpdateAddress(address.id)}
                        className='rounded bg-blue-500 px-4 py-2 text-white'>
                        저장
                      </button>
                      <button
                        onClick={() => setEditingAddress(null)}
                        className='rounded bg-gray-300 px-4 py-2'>
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='text-gray-600'>{address.general_address}</div>
                    <div className='text-gray-600'>{address.detail_address}</div>
                    {address.is_default_address && (
                      <span className='absolute right-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white'>
                        기본
                      </span>
                    )}
                    <div className='mt-2 flex justify-end space-x-2'>
                      <button onClick={() => setEditingAddress(address)} className='text-blue-500'>
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className='text-red-500'>
                        <FaTrash />
                      </button>
                      {!address.is_default_address && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className='text-gray-500'>
                          기본 배송지로 설정
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
        <div className='mt-4 space-y-2'>
          <div className='flex'>
            <input
              type='text'
              value={newAddress.general_address}
              disabled
              className='w-full rounded border p-2'
              placeholder='새 주소 입력 (검색 버튼을 눌러주세요)'
            />
            <button
              onClick={() => setIsAddressSearchOpen(true)}
              className='ml-2 rounded bg-gray-200 p-2'>
              <FaSearch />
            </button>
          </div>
          <input
            type='text'
            value={newAddress.detail_address}
            onChange={e => setNewAddress({ ...newAddress, detail_address: e.target.value })}
            className='w-full rounded border p-2'
            placeholder='상세주소 입력'
          />
          <button
            onClick={handleAddAddress}
            className='flex w-full items-center justify-center rounded bg-green-500 p-2 text-white'>
            <FaPlus className='mr-2' /> 새 배송지 추가
          </button>
        </div>
        <button onClick={onClose} className='mt-4 w-full rounded bg-gray-300 p-2 text-gray-700'>
          닫기
        </button>
      </div>
      {isAddressSearchOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-full max-w-md'>
            <button
              onClick={() => setIsAddressSearchOpen(false)}
              className='absolute -top-10 left-52 z-10 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100'>
              <FaTimes />
            </button>
            <DaumPostcode
              onComplete={handleComplete}
              autoClose={false}
              onClose={() => setIsAddressSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressModal;
