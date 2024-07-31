import Logo from "../../assets/images/logo.png";

const FetchingNextSkeleton = () => {
  return (
    <div className='mt-2 flex flex-col items-center justify-center text-center'>
      <img src={Logo} alt='연이음 로고' className='mb-2 w-16' />
      <span>상품 연이어 가져오는중..</span>
    </div>
  );
};

export default FetchingNextSkeleton;
