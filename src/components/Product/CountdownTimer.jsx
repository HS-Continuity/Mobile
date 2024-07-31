import { useState, useEffect } from "react";
import style from "./CountdownTimer.module.css";

const CountdownTimer = ({ endDateTime }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(endDateTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDateTime]);

  return (
    <div className={`grid grid-cols-3 gap-2 ${style.glass}`}>
      <div>
        <span className='text-2xl font-bold'>{timeLeft.hours}</span>
        <p className='text-xs'>시간</p>
      </div>
      <div>
        <span className='text-2xl font-bold'>{timeLeft.minutes}</span>
        <p className='text-xs'>분</p>
      </div>
      <div>
        <span className='text-2xl font-bold'>{timeLeft.seconds}</span>
        <p className='text-xs'>초</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
