import { useState } from "react";
import { BsHouse } from "react-icons/bs";
import { FaLeaf } from "react-icons/fa";

const OrderItems = ({ groupedItems }) => {
  const formatPrice = price => price.toLocaleString() + "원";

  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (customerId, itemIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [`${customerId}-${itemIndex}`]: true,
    }));
  };

  return (
    <div className='w-full'>
      <div className='mb-2 mt-2 space-y-4 rounded-lg border bg-white p-4'>
        <h2 className='text-lg font-semibold'>주문 상품</h2>
        {Object.entries(groupedItems).map(([customerId, group]) => (
          <div key={customerId} className='mb-4'>
            <div className='mb-2 flex items-center text-sm text-gray-500'>
              <BsHouse className='mr-2 text-lg' />
              <h3 className='font-semibold'>{group.storeName}</h3>
            </div>
            {group.items.map((item, index) => (
              <div key={index} className='flex flex-col border-t border-gray-100 pt-4'>
                <div className='flex items-start'>
                  {imageErrors ? (
                    <div className='flex h-20 w-20 items-center justify-center bg-gradient-to-br from-green-100 to-green-200'>
                      <FaLeaf className='mx-auto mb-2 text-4xl text-green-500' />
                    </div>
                  ) : (
                    <img
                      src={item.productImage}
                      alt={item.name}
                      className='h-20 w-20 object-cover'
                      onError={() => handleImageError(customerId, index)}
                    />
                  )}
                  <div className='ml-3 flex-grow'>
                    <p className='font-medium'>{item.name}</p>
                    <div className='text-sm'>
                      {formatPrice(item.finalPrice)} | {item.quantity}개
                    </div>
                    {item.discountAmount > 0 && (
                      <div className='text-xs text-red-500'>
                        {formatPrice(item.discountAmount)} 할인
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
