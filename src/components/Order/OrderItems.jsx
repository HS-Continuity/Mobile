const OrderItems = ({ orderItems }) => {
  return (
    <div className='rounded-lg bg-white p-4 shadow'>
      <h2 className='mb-2 font-bold'>주문 상품</h2>
      {orderItems.map((item, index) => (
        <div key={index} className='mb-2 flex items-center'>
          <img src={item.image} alt={item.name} className='mr-2 h-12 w-12 rounded object-cover' />
          <div>
            <p className='font-semibold'>{item.name}</p>
            <p className='text-sm text-gray-600'>
              {item.price.toLocaleString()}원 - {item.quantity}개
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
