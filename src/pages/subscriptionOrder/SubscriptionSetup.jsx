import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscriptionSetupStore } from "../../stores/useSubscriptionSetupStore";
import useOrderItemsValidation from "../../hooks/useOrderItemsValidation";

const SubscriptionSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupedItems, totalProductPrice, totalDeliveryFee } = location.state || {
    groupedItems: {},
    totalProductPrice: 0,
    totalDeliveryFee: 0,
  };

  const { subscriptionDetails, setSubscriptionDetails } = useSubscriptionSetupStore();
  const [deliveryDates, setDeliveryDates] = useState({ start: null, end: null });

  useOrderItemsValidation(groupedItems);

  const handleFrequencyChange = deliveryCycle => {
    setSubscriptionDetails({ ...subscriptionDetails, deliveryCycle });
  };

  const handleDurationChange = duration => {
    setSubscriptionDetails({ ...subscriptionDetails, duration });
  };

  const handleDayToggle = day => {
    let updatedDays;
    if (day === "매일") {
      updatedDays =
        subscriptionDetails.deliveryDayOfWeeks.length === 5 ? [] : ["월", "화", "수", "목", "금"];
    } else {
      if (subscriptionDetails.deliveryDayOfWeeks.includes(day)) {
        updatedDays = subscriptionDetails.deliveryDayOfWeeks.filter(d => d !== day);
      } else {
        updatedDays = [...subscriptionDetails.deliveryDayOfWeeks, day];
      }
    }

    setSubscriptionDetails({
      ...subscriptionDetails,
      deliveryDayOfWeeks: updatedDays,
    });
  };

  const getNextMonday = () => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    return nextMonday;
  };

  const getEndDate = (startDate, duration) => {
    if (!duration) return null;
    const endDate = new Date(startDate);
    const months = parseInt(duration.replace(/[^0-9]/g, ""));
    endDate.setMonth(endDate.getMonth() + months);
    endDate.setDate(endDate.getDate() - 1);
    return endDate;
  };

  useEffect(() => {
    const startDate = getNextMonday();
    const endDate = getEndDate(startDate, subscriptionDetails.duration);
    setDeliveryDates({ start: startDate, end: endDate });
    setSubscriptionDetails({
      ...subscriptionDetails,
      startDate: formatDate(startDate),
      endDate: endDate ? formatDate(endDate) : null,
    });
  }, [subscriptionDetails.duration, setSubscriptionDetails]);

  const formatDate = date => {
    return date
      ? date
          .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
          .replace(/\. /g, "-")
          .replace(/\.$/, "")
      : "";
  };

  const isFrequencySelected = !!subscriptionDetails.deliveryCycle;
  const isDurationSelected = !!subscriptionDetails.duration;
  const isDaysSelected = subscriptionDetails.deliveryDayOfWeeks.length > 0;

  const isAllSelected = isFrequencySelected && isDurationSelected && isDaysSelected;

  const handleSubmit = () => {
    if (isAllSelected) {
      navigate("/subscription-order", {
        state: { groupedItems, totalProductPrice, totalDeliveryFee },
      });
    }
  };

  return (
    <div className='flex flex-col bg-white pb-12'>
      <div className='flex-grow overflow-auto'>
        <div className='container mx-auto p-4'>
          <div className='mb-4'>
            <h2 className='mb-2 font-bold'>
              배송 주기 {!isFrequencySelected && <span className='text-red-500'>*</span>}
            </h2>
            <div className='flex flex-wrap gap-2'>
              {["1주", "2주", "3주", "4주"].map(option => (
                <button
                  key={option}
                  className={`btn border border-gray-400 ${subscriptionDetails.deliveryCycle === option ? "bg-green-shine text-white hover:bg-[#00835F]" : "bg-white hover:bg-green-shine hover:text-white"}`}
                  onClick={() => handleFrequencyChange(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className='mb-4'>
            <h2 className='mb-2 font-bold'>
              배송 기간 {!isDurationSelected && <span className='text-red-500'>*</span>}
            </h2>
            <div className='flex flex-wrap gap-2'>
              {["1개월", "2개월", "3개월", "4개월", "5개월", "6개월"].map(option => (
                <button
                  key={option}
                  className={`btn border border-gray-400 ${subscriptionDetails.duration === option ? "bg-green-shine text-white hover:bg-[#00835F]" : "bg-white hover:bg-green-shine hover:text-white"}`}
                  onClick={() => handleDurationChange(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className='mb-4'>
            <h2 className='mb-2 font-bold'>
              배송요일 {!isDaysSelected && <span className='text-red-500'>*</span>}
            </h2>
            <div className='flex flex-wrap gap-2'>
              {["월", "화", "수", "목", "금", "매일"].map(day => (
                <button
                  key={day}
                  className={`btn border border-gray-400 ${
                    day === "매일"
                      ? subscriptionDetails.deliveryDayOfWeeks.length === 5
                        ? "bg-green-shine text-white hover:bg-[#00835F]"
                        : "bg-white hover:bg-green-shine hover:text-white"
                      : subscriptionDetails.deliveryDayOfWeeks.includes(day)
                        ? "bg-green-shine text-white hover:bg-[#00835F]"
                        : "bg-white hover:bg-green-shine hover:text-white"
                  }`}
                  onClick={() => handleDayToggle(day)}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-4 rounded bg-white'>
            <h2 className='mb-2 font-bold'>배송 기간</h2>
            <p>
              {formatDate(deliveryDates.start)} ~{"\u00A0"}
              {deliveryDates.end ? formatDate(deliveryDates.end) : ""}
            </p>
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 flex justify-center bg-gray-50'>
        <div className='main-container w-full'>
          <button
            className={`w-full p-4 text-lg font-bold text-white ${
              isAllSelected ? "bg-green-shine" : "bg-gray-400"
            }`}
            onClick={handleSubmit}
            disabled={!isAllSelected}>
            정기 배송 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSetup;
