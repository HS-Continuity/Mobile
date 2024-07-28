import { FaEdit } from "react-icons/fa";
import AddressModal from "./AddressModal";

const DeliveryAddress = ({
  selectedAddress,
  isAddressModalOpen,
  handleOpenAddressModal,
  handleCloseAddressModal,
  memberId,
  onSelectAddress,
}) => {
  return (
    <div className='bg-white p-4'>
      <div className='mb-2 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>배송지 : {selectedAddress?.addressName || "미선택"}</h2>
        <button
          className='rounded border border-gray-300 px-2 py-1 text-sm'
          onClick={handleOpenAddressModal}>
          <FaEdit className='mb-1 mr-1 inline-block' />
          {selectedAddress ? "변경" : "등록"}
        </button>
      </div>

      <div className='col-span-2 rounded-lg bg-white'>
        <div className='mt-1'>
          {selectedAddress ? (
            selectedAddress.generalAddress + "\u00a0" + selectedAddress.detailAddress
          ) : (
            <span className='text-sm text-gray-500'>현재 등록된 배송지가 없습니다</span>
          )}
        </div>
      </div>
      <div className='flex'>
        <div className='mt-1 text-gray-500'>
          {selectedAddress ? (
            selectedAddress.recipientName + " / " + selectedAddress.recipientPhoneNumber
          ) : (
            <span className='text-sm text-gray-500'>현재 등록된 정보가 없습니다.</span>
          )}
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        memberId={memberId}
        onSelectAddress={onSelectAddress}
      />
    </div>
  );
};

export default DeliveryAddress;
