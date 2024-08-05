import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionOrderListQuery } from "../../apis";
import { FaChevronRight, FaLeaf } from "react-icons/fa";
import getStatusText from "../../components/Order/GetStatusText";
import getStatusStyle from "../../components/Order/GetStatusStyle";

const SubscriptionOrderList = ({ memberId, startDate, endDate }) => {
  const observerTarget = useRef(null);
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useSubscriptionOrderListQuery({ startDate, endDate });

  console.log(data);

  const handleObserver = useCallback(
    entries => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleViewDetail = order => {
    navigate(`/subscription-history/${order.regularOrderId}`, { state: { order } });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);

  if (isLoading) return <div className='flex h-screen items-center justify-center'>Loading...</div>;
  if (isError)
    return (
      <div className='flex h-screen items-center justify-center text-red-500'>{error.message}</div>
    );

  const orders = data?.pages.flatMap(page => page.result.content) || [];

  // 중복 제거
  const uniqueOrders = Array.from(
    new Map(orders.map(order => [order.regularOrderId, order])).values()
  );

  if (uniqueOrders.length === 0) {
    return <div className='py-4 text-center'>정기 주문 내역이 없습니다.</div>;
  }

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatPrice = price => {
    return (price || 0).toLocaleString() + "원";
  };

  return (
    <div className='space-y-3'>
      {uniqueOrders.map(order => (
        <div
          key={order.regularOrderId}
          className='cursor-pointer rounded-lg border border-gray-200 bg-white p-4'
          onClick={() => handleViewDetail(order)}>
          <div className='mb-1 flex items-center justify-between'>
            <div className='flex'>
              <div className='text-lg font-semibold text-gray-700'>
                {formatDate(order.orderDate)}
              </div>
              <div className='ml-2 mt-[3px] text-sm font-light'>정기 주문</div>
            </div>
            <div className='flex items-center'>
              <div
                className={`rounded bg-gradient-shine px-2 py-1 text-sm font-semibold ${getStatusStyle(order.status).bg} ${getStatusStyle(order.status).text}`}>
                {getStatusText(order.regularDeliveryStatus)}
              </div>
            </div>
          </div>
          <div className='flex items-start space-x-4'>
            {order.productOrder.productImage ? (
              <img
                src={order.productOrder.productImage}
                alt={order.productOrder.productName || "상품 이미지"}
                className='h-20 w-20 object-cover'
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/80";
                }}
              />
            ) : (
              <div className='flex h-20 w-20 items-center justify-center bg-gradient-to-br from-green-100 to-green-200'>
                <FaLeaf className='text-4xl text-green-500' />
              </div>
            )}
            <div className='flex-grow'>
              <div className='text-sm font-light'>
                {order.isAvailableProductService ? order.storeName || "판매자명" : ""}
              </div>
              <div className='font-semibold'>
                {order.isAvailableProductService ? (
                  order.productOrder.productName || "상품명 없음"
                ) : (
                  <p className='font-small text-red-600'>
                    현재 상품 조회 서비스가 불가합니다.
                    <br />
                    [정기주문 상세조회 서비스 가능]
                  </p>
                )}
                <span className='text-sm text-gray-500'>
                  {order.isAvailableProductService
                    ? order.productOrder.length > 1 && ` 외 ${order.productOrder.length - 1}건`
                    : ""}
                </span>
              </div>
              <div className='text-sm'>
                {order.isAvailableProductService ? formatPrice(order.productOrder.finalPrice) : ""}{" "}
                | {order.isAvailableProductService ? order.productOrder.productAmount : ""}개
              </div>
              <div className='relative'>
                <FaChevronRight className='absolute -top-8 right-6 ml-2 text-xl text-gray-400' />
              </div>
            </div>
          </div>
        </div>
      ))}
      {isFetchingNextPage && (
        <div className='mt-4 text-center'>더 많은 정기 주문 내역 가져오는 중...</div>
      )}
      {!hasNextPage && uniqueOrders.length > 0 && (
        <div className='mt-4 text-center text-gray-500'>모든 정기 주문 내역을 불러왔습니다.</div>
      )}
      {hasNextPage && <div ref={observerTarget} className='h-10' />}
    </div>
  );
};

export default SubscriptionOrderList;
