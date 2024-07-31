const StarRating = ({ rating, count }) => {
  const MAX_STARS = 5;
  const getStarWidth = starIndex => {
    const width = Math.max(0, Math.min(100, (rating - starIndex) * 100));
    return `${width}%`;
  };

  // rating이 0일 때 빈 div 반환
  if (rating == 0 || rating == null) {
    return <div></div>;
  }

  return (
    <div className='mt-1 flex'>
      {[...Array(MAX_STARS)].map((_, index) => (
        <div key={index} className='relative -ml-[2px] h-4 w-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='#c6cfde'
            viewBox='0 0 24 24'
            stroke='none'
            className='h-full w-full text-white'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={0}
              d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
            />
          </svg>
          <div
            className='absolute left-0 top-0 overflow-hidden'
            style={{ width: getStarWidth(index) }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
              stroke='none'
              className='h-4 w-4 text-yellow-400'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={0}
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
          </div>
        </div>
      ))}
      {count ? (
        <span className='-mt-[3px] ml-1 flex font-light text-gray-400'>
          {rating} <p className='mx-1 mt-[3px] text-xs font-[100]'>|</p> {count}건
        </span>
      ) : (
        <span className='-mt-[3px] ml-1 flex font-light text-gray-400'>
          {rating} <p className='mx-1 mt-[3px] text-xs font-[100]'></p>
        </span>
      )}
    </div>
  );
};

export default StarRating;
