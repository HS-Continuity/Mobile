import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false);
    }, 300);
  };

  if (!isOpen && !isAnimatingOut) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className={`h-full w-full bg-white shadow-xl transition-all duration-300 ease-in-out sm:w-full md:w-full lg:w-[500px] xl:w-[500px] ${
          isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
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
