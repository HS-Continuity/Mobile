const Item = ({ image, title, price, detail, count }) => {
  return (
    <>
      <div className='mb-4 rounded-lg bg-white p-4 shadow-md'>
        <img src={image} alt={title} className='mb-2 h-40 w-full object-cover' />
        <h3 className='font-semibold'>{title}</h3>
        <p className='text-gray-600'>{price}원</p>
        <p className='text-sm text-gray-500'>{detail}</p>
        <p className='text-sm text-gray-500'>수량: {count}</p>
      </div>
    </>
  );
};

export default Item;
