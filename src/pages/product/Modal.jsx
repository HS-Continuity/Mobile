import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingIn(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimatingIn) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        className={`h-full w-full bg-white shadow-xl transition-all duration-300 ease-in-out sm:w-full md:w-full lg:w-[500px] xl:w-[500px] ${
          isAnimatingIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b p-4'>
            <h2 className='text-xl font-bold'>{title}</h2>
            <button onClick={handleClose} className='text-gray-500 hover:text-gray-700'>
              <FaTimes className='text-xl' />
            </button>
          </div>
          <div className='noScrollbar flex-grow overflow-y-auto p-4'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
