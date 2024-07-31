import { useState, useEffect } from "react";
import { FaBackspace } from "react-icons/fa";

const VirtualKeypad = ({ onKeyPress, maxLength, onClose, currentValue }) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const shuffled = [...Array(10).keys()].sort(() => Math.random() - 0.5);
    setKeys(shuffled);
  }, []);

  const handleKeyPress = key => {
    if (currentValue.length < maxLength) {
      onKeyPress(key);
    }
  };

  const handleBackspace = () => {
    onKeyPress("backspace");
  };

  return (
    <div className='main-container fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='absolute bottom-0 h-[250px] w-full rounded-lg bg-white p-4'>
        <div className='grid grid-cols-4 gap-2'>
          {keys.slice(0, 9).map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className='rounded-md bg-gray-50 p-4 text-3xl font-semibold hover:bg-gray-100'>
              {key}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress(keys[9])}
            className='rounded-md bg-gray-50 p-4 text-3xl font-semibold hover:bg-gray-100'>
            {keys[9]}
          </button>
          <button
            onClick={handleBackspace}
            className='rounded-md bg-gray-50 p-4 text-3xl font-semibold hover:bg-gray-100'>
            <FaBackspace className='ml-7' />
          </button>
          <button
            onClick={onClose}
            className='col-span-1 rounded-md bg-blue-500 p-4 text-3xl font-semibold text-white hover:bg-blue-600'>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeypad;
