import { FaTicketAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useCouponStore from "../../stores/useCouponStore";
import { fetchMemberCoupon } from "../../apis";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import CouponSkeleton from "../../components/Skeletons/CouponSkeleton";
import NoCoupon from "./NoCoupon";

const Coupon = () => {
  const { username } = useAuthStore();
  const memberId = username;
  const { setCoupons } = useCouponStore();

  const {
    data: coupons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["coupon", memberId],
    queryFn: () => fetchMemberCoupon(memberId),
    enabled: !!memberId,
  });

  useEffect(() => {
    if (coupons) {
      setCoupons(coupons);
    }
  }, [coupons, setCoupons]);

  const isExpired = expirationDate => {
    return new Date(expirationDate) < new Date();
  };

  if (isLoading) return <CouponSkeleton />;
  if (isError) return <div className='text-center text-red-500'>오류가 발생했습니다.</div>;
  if (!coupons || coupons.length === 0) return <NoCoupon />;

  return (
    <div className='container mx-auto p-4'>
      <div className=''>
        <h2 className='mb-4 text-xl font-semibold'>쿠폰함</h2>
        {coupons.map(coupon => {
          const expired = isExpired(coupon.expiration_date);
          return (
            <div
              key={coupon.couponId}
              className={`card mb-4 shadow-md ${expired ? "bg-gray-200" : "bg-base-100"}`}>
              <div className='card-body'>
                <h2 className='card-title'>{coupon.couponName}</h2>
                <div className='flex items-center justify-between'>
                  <p className='text-2xl font-bold text-[#EF4444]'>
                    {coupon.discountAmount.toLocaleString()}원
                  </p>
                  <div className='card-actions'>
                    {expired ? (
                      <button className='btn bg-gray-400 text-white' disabled>
                        기간 만료
                      </button>
                    ) : (
                      <Link to={"/"}>
                        <button className='btn bg-green-shine text-white hover:bg-green-shine'>
                          <FaTicketAlt className='mr-2' /> 사용하러가기
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
                <p className='text-sm text-gray-500'>유효기간: {coupon.expirationDate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Coupon;
