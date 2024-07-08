import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import style from "./CategoryMenu.module.css";

const CategoryMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const categories = [
    { name: "과일/채소", icon: "🍎🥦" },
    { name: "채소", icon: "🥬" },
    { name: "쌀/잡곡", icon: "🌾" },
    { name: "정육/계란", icon: "🥩🥚" },
    { name: "수산/건어물", icon: "🐟" },
    { name: "김치/반찬", icon: "🥬🍱" },
    { name: "유제품", icon: "🥛" },
    { name: "소스/양념/오일", icon: "🧂" },
    { name: "주류", icon: "🍺" },
    { name: "생수/음료", icon: "🥤" },
    { name: "건강식품", icon: "💊" },
    { name: "화장지/물티슈", icon: "🧻" },
  ];

  const handleCategoryClick = categoryName => {
    // navigate(`/category/${categoryName}`);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-white ${isOpen ? style["animate-slide-up"] : "hidden"} flex flex-col`}
      style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div className='flex items-center justify-between border-b p-4'>
        <h2 className='text-xl font-semibold'>카테고리</h2>
      </div>
      <div className={`${style.nonescroll} flex-grow overflow-y-auto p-4`}>
        <div className='grid grid-cols-3 gap-4'>
          {categories.map(category => (
            <div
              key={category.name}
              className='flex cursor-pointer flex-col items-center justify-center'
              onClick={() => handleCategoryClick(category.name)}>
              <div className='mb-2 text-3xl'>{category.icon}</div>
              <span className='text-center text-sm'>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute bottom-2 left-0 right-0 flex justify-center'>
        <button onClick={onClose} className='rounded-full bg-[#00835F] p-2 text-white'>
          <IoClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default CategoryMenu;
