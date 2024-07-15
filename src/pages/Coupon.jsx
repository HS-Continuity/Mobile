import { FaTicketAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useCouponStore from "../stores/useCouponStore";
import { fetchCoupons } from "../apis";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Coupon = () => {
  const memberId = 1;
  const { setCoupons } = useCouponStore();

  const {
    data: coupons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["coupons", memberId],
    queryFn: () => fetchCoupons(memberId),
  });

  useEffect(() => {
    if (coupons) {
      setCoupons(coupons);
    }
  }, [coupons, setCoupons]);

  const isExpired = expirationDate => {
    return new Date(expirationDate) < new Date();
  };

  if (isLoading) return <div className='flex h-screen items-center justify-center'>로딩 중...</div>;
  if (isError) return <div className='text-center text-red-500'>오류가 발생했습니다.</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>할인쿠폰 등록</h1>
      <div className='form-control'>
        <div className='input-group flex'>
          <input
            type='text'
            placeholder='쿠폰 번호를 입력해주세요.'
            className='input input-bordered w-full'
          />
          <button className='btn btn-square bg-[#00835F] text-white'>등록</button>
        </div>
      </div>
      <div className='mt-8'>
        <h2 className='mb-4 text-xl font-semibold'>쿠폰함</h2>
        {coupons?.map(coupon => {
          const expired = isExpired(coupon.expiration_date);
          return (
            <div
              key={coupon.id}
              className={`card mb-4 shadow-xl ${expired ? "bg-gray-200" : "bg-base-100"}`}>
              <div className='card-body'>
                <h2 className='card-title'>{coupon.coupon_name}</h2>
                <p className='text-2xl font-bold text-[#00835F]'>
                  {coupon.discount_amount.toLocaleString()}원
                </p>
                <p className='text-sm text-gray-500'>유효기간: {coupon.expiration_date}</p>
                <div className='card-actions justify-end'>
                  {expired ? (
                    <button className='btn bg-gray-400 text-white' disabled>
                      기간 만료
                    </button>
                  ) : (
                    <Link to={"/"}>
                      <button className='btn bg-[#00835F] text-white'>
                        <FaTicketAlt className='mr-2' /> 사용하러가기
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Coupon;
