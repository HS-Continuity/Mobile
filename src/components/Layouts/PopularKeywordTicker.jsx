import { useState, useEffect } from "react";

const PopularKeywordTicker = ({ keywords, onKeywordClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % keywords.length);
    }, 1000); // 3초마다 변경

    return () => clearInterval(interval);
  }, [keywords.length]);
  console.log(currentIndex);

  return (
    <div className='ml-2 h-6 overflow-hidden'>
      {keywords.map((keyword, index) => (
        <div
          key={index}
          className={`cursor-pointer hover:text-[#00835F]`}
          style={{
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            display: Math.abs(index - currentIndex) > 1 ? "none" : "block",
          }}
          onClick={() => onKeywordClick(keyword.searchName)}>
          {index + 1}. {keyword.searchName}
        </div>
      ))}
    </div>
  );
};

export default PopularKeywordTicker;
