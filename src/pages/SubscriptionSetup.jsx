import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { useSubscriptionSetupStore } from "../stores/useSubscriptionSetupStore";
import useOrderItemsValidation from "../hooks/useOrderItemsValidation";

const SubscriptionSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderItems } = location.state || { orderItems: [] };

  const { subscriptionDetails, setSubscriptionDetails } = useSubscriptionSetupStore();
  const [deliveryDates, setDeliveryDates] = useState({ start: null, end: null });

  useOrderItemsValidation(orderItems);

  const handleFrequencyChange = frequency => {
    if (frequency === "매일") {
      setSubscriptionDetails({
        ...subscriptionDetails,
        frequency,
        selectedDays: ["월", "화", "수", "목", "금"],
      });
    } else if (subscriptionDetails.frequency === "매일") {
      setSubscriptionDetails({
        ...subscriptionDetails,
        frequency,
        selectedDays: [],
      });
    } else {
      setSubscriptionDetails({ ...subscriptionDetails, frequency });
    }
  };

  const handleDurationChange = duration => {
    setSubscriptionDetails({ ...subscriptionDetails, duration });
  };

  const handleDayToggle = day => {
    let updatedDays;
    if (subscriptionDetails.selectedDays.includes(day)) {
      updatedDays = subscriptionDetails.selectedDays.filter(d => d !== day);
    } else {
      updatedDays = [...subscriptionDetails.selectedDays, day];
    }

    const isEveryDaySelected = updatedDays.length === 5;
    setSubscriptionDetails({
      ...subscriptionDetails,
      selectedDays: updatedDays,
      frequency: isEveryDaySelected ? "매일" : subscriptionDetails.frequency,
    });
  };

  const getNextMonday = () => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    return nextMonday;
  };

  const getEndDate = (startDate, duration) => {
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
  }, [subscriptionDetails.duration]);

  const formatDate = date => {
    return date
      ? date
          .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
          .replace(/\. /g, ".")
      : "";
  };

  const isFrequencySelected = !!subscriptionDetails.frequency;
  const isDurationSelected = !!subscriptionDetails.duration;
  const isDaysSelected = subscriptionDetails.selectedDays.length > 0;

  const isAllSelected = isFrequencySelected && isDurationSelected && isDaysSelected;

  const handleSubmit = () => {
    if (isAllSelected) {
      navigate("/subscription-order", { state: { orderItems } });
    }
  };

  return (
    <div className='flex h-screen flex-col bg-gray-100'>
      <div className='flex items-center bg-[#00835F] p-4 text-white'>
        <FaChevronLeft className='mr-4 cursor-pointer' onClick={() => navigate(-1)} />
        <h1 className='text-xl font-bold'>정기 배송 신청</h1>
      </div>

      <div className='flex-1 overflow-auto p-4'>
        <div className={`mb-4`}>
          <h2 className='mb-2 font-bold'>
            배송 주기 {!isFrequencySelected && <span className='text-red-500'>*</span>}
          </h2>
          <div className='flex space-x-2'>
            {["1주", "2주", "3주", "4주", "매일"].map(option => (
              <button
                key={option}
                className={`btn ${subscriptionDetails.frequency === option ? "btn-primary" : "btn-outline"}`}
                onClick={() => handleFrequencyChange(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={`mb-4`}>
          <h2 className='mb-2 font-bold'>
            배송 기간 {!isDurationSelected && <span className='text-red-500'>*</span>}
          </h2>
          <div className='flex flex-wrap gap-2'>
            {["1개월", "2개월", "3개월", "4개월", "5개월", "6개월"].map(option => (
              <button
                key={option}
                className={`btn ${subscriptionDetails.duration === option ? "btn-primary" : "btn-outline"}`}
                onClick={() => handleDurationChange(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={`mb-4`}>
          <h2 className='mb-2 font-bold'>
            배송요일 {!isDaysSelected && <span className='text-red-500'>*</span>}
          </h2>
          <div className='flex space-x-2'>
            {["월", "화", "수", "목", "금"].map(day => (
              <button
                key={day}
                className={`btn ${subscriptionDetails.selectedDays.includes(day) ? "btn-primary" : "btn-outline"}`}
                onClick={() => handleDayToggle(day)}>
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-4 rounded bg-white p-4 shadow'>
          <h2 className='mb-2 font-bold'>배송 기간</h2>
          <p>
            {formatDate(deliveryDates.start)} ~
            {formatDate(deliveryDates.end) == "Invalid Date" ? "" : formatDate(deliveryDates.end)}
          </p>
        </div>
      </div>

      <button
        className={`p-4 text-lg font-bold text-white ${isAllSelected ? "bg-[#00835F]" : "bg-gray-400"}`}
        onClick={handleSubmit}
        disabled={!isAllSelected}>
        정기 배송 신청하기
      </button>
    </div>
  );
};

export default SubscriptionSetup;
