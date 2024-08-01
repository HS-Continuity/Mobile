import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMemberSubscriptionDetail,
  putSubscriptionOrderCancel,
  putSubscriptionOrderPostpone,
} from "../../apis";
import { BsHouse } from "react-icons/bs";
import { MdChevronRight } from "react-icons/md";
import toast from "react-hot-toast";
import getStatusText from "../../components/Order/GetStatusText";
import getStatusStyle from "../../components/Order/GetStatusStyle";

const SubscriptionOrderDetail = () => {
  const { regularOrderId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscriptionOrderDetail", regularOrderId],
    queryFn: () => fetchMemberSubscriptionDetail(parseInt(regularOrderId)),
    enabled: !!regularOrderId,
  });

  console.log(data);
  const postponeMutation = useMutation({
    mutationFn: regularOrderId => putSubscriptionOrderPostpone(regularOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptionOrderDetail", regularOrderId]);
      toast.success("정기주문이 연기되었습니다.");
    },
    onError: error => {
      toast.error(`연기 실패: ${error.message}`);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: regularOrderId => putSubscriptionOrderCancel(regularOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptionOrderDetail", regularOrderId]);
      toast.success("정기주문이 취소되었습니다.");
    },
    onError: error => {
      toast.error(`취소 실패: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div className='flex h-screen items-center justify-center'>Loading...</div>;
  }

  if (isError) {
    return (
      <div className='flex h-screen items-center justify-center text-red-500'>
        Error: {error.message}
      </div>
    );
  }

  if (!data) {
    return <div className='flex h-screen items-center justify-center'>No data available</div>;
  }

  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  const formatPrice = price => price.toLocaleString() + "원";

  const convertToKoreanDay = englishDay => {
    const dayMap = {
      MONDAY: "월",
      TUESDAY: "화",
      WEDNESDAY: "수",
      THURSDAY: "목",
      FRIDAY: "금",
      SATURDAY: "토",
      SUNDAY: "일",
    };
    return dayMap[englishDay] || englishDay;
  };

  const handlePostpone = () => {
    toast(
      t => (
        <div className='flex flex-col items-start'>
          <span>이번 정기주문 회차를 연기하시겠습니까?</span>
          <div className='mt-2 flex'>
            <button
              className='btn mr-2 h-10 rounded bg-transparent px-2 py-1 text-black hover:bg-white'
              onClick={() => {
                postponeMutation.mutate(regularOrderId);
                toast.dismiss(t.id);
              }}>
              확인
            </button>
            <button
              className='btn h-10 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-500'
              onClick={() => {
                toast.dismiss(t.id);
              }}>
              취소
            </button>
          </div>
        </div>
      ),
      {
        duration: 2000,
      }
    );
  };

  const handleDelete = () => {
    toast(
      t => (
        <span>
          정기 주문을 취소하시겠습니까?
          <button
            className='btn ml-2 h-10 rounded bg-transparent px-2 py-1 text-black hover:bg-white'
            onClick={() => {
              cancelMutation.mutate(regularOrderId);
              toast.dismiss(t.id);
            }}>
            확인
          </button>
          <button
            className='btn ml-2 h-10 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-500'
            onClick={() => {
              toast.dismiss(t.id);
            }}>
            취소
          </button>
        </span>
      ),
      {
        duration: 2000,
      }
    );
  };

  return (
    <div className='container mx-auto max-w-2xl p-4 pb-12'>
      <div className='mb-2 rounded-lg border p-4'>
        <div className='flex justify-between'>
          <span className='font-semibold'>No. {data.regularOrderId}</span>
          <div
            className={`rounded bg-gradient-shine px-2 py-1 text-sm font-semibold ${
              getStatusStyle(data.regularDeliveryStatus).bg
            } ${getStatusStyle(data.regularDeliveryStatus).text}`}>
            {getStatusText(data.regularDeliveryStatus)}
          </div>
        </div>

        <div className='mt-2 flex items-center justify-between text-sm text-gray-500'>
          <div className='mt-[2px] flex'>
            <BsHouse className='mt-[3px] text-lg' />
            <h3 className='ml-2 mt-[2px]'>{data.storeName}</h3>
            <MdChevronRight className='ml-1 mt-[5px]' />
          </div>
        </div>
      </div>

      <div className='rounded-lg border p-4'>
        <h2 className='mb-2 text-xl font-semibold'>배송 정보</h2>
        <hr className='mb-3 border-gray-200' />
        <div className='space-y-1'>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>받는 분</span>
            <span>{data.recipient.recipient}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>전화번호</span>
            <span>{data.recipient.recipientPhoneNumber}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송지</span>
            <span>{data.recipient.recipientAddress}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송메모</span>
            <span>{data.orderMemo || ""}</span>
          </div>
        </div>
      </div>

      <div className='mb-2 mt-2 space-y-4 rounded-lg border p-4'>
        <h2 className='text-xl font-semibold'>주문 상품</h2>
        {data.productOrderList.productOrderList.map((product, index) => (
          <div key={index} className='flex flex-col border-t border-gray-100 pt-4'>
            <div className='flex items-start'>
              <div className='font-normal text-gray-500'>{product.status}</div>
              <img
                src={product.productImage || "https://via.placeholder.com/80"}
                alt={product.productName || "상품 이미지"}
                className='h-20 w-20 object-cover'
              />
              <div className='ml-3 flex-grow'>
                <p className='font-medium'>{product.productName}</p>
                <div className='text-sm'>
                  {formatPrice(product.finalPrice)} | {product.productAmount}개
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mb-2 rounded-lg border p-4'>
        <h2 className='mb-2 text-xl font-semibold'>정기 배송</h2>
        <hr className='mb-3 border-gray-200' />
        <div className='space-y-1'>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>다음 배송 </span>
            <span>{formatDate(data.nextDeliveryDate)}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송 주기 </span>
            <span>{data.deliveryPeriod.deliveryCycle}주 마다</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송 요일 </span>
            <span>{data.deliveryPeriod.deliveryDayOfWeeks.map(convertToKoreanDay).join(", ")}</span>
          </div>
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>배송 기간 </span>
            <span>
              {formatDate(data.deliveryPeriod.startDate)} ~{" "}
              {formatDate(data.deliveryPeriod.endDate)}
            </span>
          </div>
        </div>
      </div>

      <div className='mb-4 rounded-lg border p-4 shadow-sm'>
        <h2 className='mb-4 text-xl font-semibold'>결제 정보</h2>

        <div className='space-y-2'>
          <div className='flex justify-between'>
            <span>상품 금액</span>
            <span>{formatPrice(data.productOrderList.productOrderList[0].originPrice)}</span>
          </div>
          <div className='flex justify-between'>
            <span>할인 금액</span>
            <span className='text-red-500'>
              -{" "}
              {formatPrice(
                data.productOrderList.productOrderList[0].originPrice -
                  data.productOrderList.productOrderList[0].finalPrice
              )}
            </span>
          </div>
          <div className='flex justify-between border-t pt-2 font-bold'>
            <span>총 결제 금액</span>
            <span>{formatPrice(data.paymentAmount)}</span>
          </div>
        </div>
      </div>

      <div className='mb-8 flex justify-center space-x-2'>
        <button
          className='btn btn-sm h-10 flex-1 bg-transparent text-yellow-700 hover:bg-white'
          onClick={handlePostpone}>
          정기배송 연기
        </button>
        <button
          className='btn btn-sm h-10 flex-1 bg-transparent text-gray-500 hover:bg-white'
          onClick={handleDelete}>
          정기배송 취소
        </button>
      </div>
    </div>
  );
};

export default SubscriptionOrderDetail;
