import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const MypageMenu = ({ icon, text, to }) => (
  <Link to={to} className='block'>
    <div className='flex items-center bg-white p-3 shadow transition-colors duration-200 hover:bg-gray-50'>
      <div className='mr-4 p-2 text-[#00835F]'>{icon}</div>
      <span className='flex-1'>{text}</span>
      <FaChevronLeft className='rotate-180 transform text-gray-400' />
    </div>
  </Link>
);

export default MypageMenu;
