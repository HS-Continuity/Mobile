import SubscriptionOrderList from "./SubscriptionOrderList";
import useAuthStore from "../../stores/useAuthStore";
import { useEffect, useState } from "react";

const SubscriptionOrderHistory = () => {
  const { username } = useAuthStore();
  const memberId = username;

  const [startDate, setStartDate] = useState(getMonthAgo(1));
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [isCustomDate, setIsCustomDate] = useState(false);

  function getMonthAgo(num) {
    const date = new Date();
    date.setMonth(date.getMonth() - num);
    return formatDate(date);
  }

  function getCurrentDate() {
    return formatDate(new Date());
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const updateEndDate = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeUntilMidnight = nextMidnight - now;

      setTimeout(() => {
        setEndDate(getCurrentDate());
        setInterval(() => setEndDate(getCurrentDate()), 24 * 60 * 60 * 1000);
      }, timeUntilMidnight);
    };

    updateEndDate();

    return () => {
      clearTimeout();
      clearInterval();
    };
  }, []);

  const handleDateChange = e => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handlePeriodClick = months => {
    setStartDate(getMonthAgo(months));
    setEndDate(getCurrentDate());
    setIsCustomDate(false);
  };

  const handleCustomDateClick = () => {
    setIsCustomDate(true);
  };

  return (
    <div className='mb-20 space-y-4 p-4'>
      <div className='mb-4 space-y-2'>
        <div className='mb-2 flex items-center space-x-2'>
          <button
            onClick={() => handlePeriodClick(1)}
            className='btn flex-1 bg-transparent shadow-sm hover:bg-transparent'>
            최근 1개월
          </button>
          <button
            onClick={() => handlePeriodClick(3)}
            className='btn flex-1 bg-transparent shadow-sm hover:bg-transparent'>
            최근 3개월
          </button>
          <button
            onClick={handleCustomDateClick}
            className='btn flex-1 bg-transparent shadow-sm hover:bg-transparent'>
            직접 입력
          </button>
        </div>
        {isCustomDate && (
          <div className='flex w-full items-center space-x-2'>
            <input
              type='date'
              name='startDate'
              min={getMonthAgo(3)}
              max={getCurrentDate()}
              value={startDate}
              onChange={handleDateChange}
              className='input input-bordered w-full'
            />
            <span>~</span>
            <input
              type='date'
              name='endDate'
              value={endDate}
              max={getCurrentDate()}
              onChange={handleDateChange}
              className='input input-bordered w-full'
            />
          </div>
        )}
      </div>

      <SubscriptionOrderList memberId={memberId} startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default SubscriptionOrderHistory;
