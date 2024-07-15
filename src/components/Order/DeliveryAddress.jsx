import { FaEdit, FaMapMarkerAlt } from "react-icons/fa";
import AddressModal from "./AddressModal";

const DeliveryAddress = ({
  defaultAddress,
  isAddressModalOpen,
  handleOpenAddressModal,
  handleCloseAddressModal,
  memberId,
}) => {
  return (
    <div className='col-span-2 flex items-center justify-between rounded-lg bg-white p-4 shadow'>
      <h4 className='text-md font-bold'>배송지</h4>
      <div className='flex items-center'>
        <FaMapMarkerAlt className='mr-2 text-gray-500' />
        {defaultAddress ? (
          defaultAddress.general_address
        ) : (
          <span>현재 등록된 배송지가 없습니다</span>
        )}
      </div>
      <button
        className='rounded border border-gray-300 px-2 py-1 text-sm'
        onClick={handleOpenAddressModal}>
        <FaEdit className='mb-1 mr-1 inline-block' />
        {defaultAddress ? "변경" : "등록"}
      </button>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        memberId={memberId}
      />
    </div>
  );
};

export default DeliveryAddress;
