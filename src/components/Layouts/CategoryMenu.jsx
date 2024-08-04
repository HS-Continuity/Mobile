import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import style from "./CategoryMenu.module.css";
import { categories } from "../Layouts/CategoryData";

const CategoryMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleCategoryClick = categoryName => {
    setExpandedCategory(categoryName === expandedCategory ? null : categoryName);
  };

  const handleSubCategoryClick = (category, subCategory) => {
    navigate(`/category/${category}/${subCategory}`);
    onClose();
  };

  const renderCategories = () => {
    let gridItems = [];
    // 마지막 카테고리를 제외하기 위해 length - 1을 사용합니다.
    for (let i = 0; i < categories.length - 1; i += 3) {
      const rowCategories = categories.slice(i, Math.min(i + 3, categories.length - 1));
      gridItems.push(
        <React.Fragment key={i}>
          {rowCategories.map((category, index) => (
            <div
              key={category.name}
              className='flex cursor-pointer flex-col items-center justify-center'
              onClick={() => handleCategoryClick(category.name)}
              style={{ gridArea: `cat${i + index + 1}` }}>
              <div className='mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-50'>
                <img
                  src={category.icon}
                  alt={category.name}
                  className='h-12 w-12 object-contain transition-all duration-300 ease-in-out group-hover:scale-110'
                />
              </div>
              <span className='text-center text-sm'>{category.name}</span>
            </div>
          ))}
          {expandedCategory && rowCategories.some(cat => cat.name === expandedCategory) && (
            <div
              className='col-span-3 rounded-lg bg-gray-50 p-4'
              style={{ gridArea: `exp${Math.floor(i / 3) + 1}` }}>
              <div className='grid grid-cols-3 gap-3'>
                {categories
                  .find(cat => cat.name === expandedCategory)
                  .subCategories.map(subCategory => (
                    <div
                      key={subCategory}
                      className='cursor-pointer rounded-md bg-white px-3 py-3 text-center text-sm transition-all duration-300 ease-in-out hover:bg-gray-100'
                      onClick={() => handleSubCategoryClick(expandedCategory, subCategory)}>
                      {subCategory}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </React.Fragment>
      );
    }
    return gridItems;
  };

  const getGridTemplateAreas = () => {
    let areas = [];
    for (let i = 0; i < Math.ceil(categories.length / 3); i++) {
      areas.push(`"cat${i * 3 + 1} cat${i * 3 + 2} cat${i * 3 + 3}"`);
      areas.push(`"exp${i + 1} exp${i + 1} exp${i + 1}"`);
    }
    return areas.join(" ");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? style["animate-slide-up"] : "hidden"
      } flex-col`}
      style={{ maxWidth: "100%", margin: "0 auto" }}>
      <div className='h-full w-full bg-white shadow-xl transition-all duration-300 ease-in-out sm:w-full md:w-full lg:max-w-[500px] xl:max-w-[500px]'>
        <div className='flex items-center justify-center border-b p-4'>
          <h2 className='text-xl font-semibold'>카테고리</h2>
        </div>
        <div className='noScrollbar mt-24 flex-grow overflow-y-auto p-4'>
          <div
            className='grid gap-4'
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateAreas: getGridTemplateAreas(),
            }}>
            {renderCategories()}
          </div>
        </div>
        <div className='absolute bottom-2 left-0 right-0 flex justify-center'>
          <button onClick={onClose} className='rounded-full bg-green-shine p-[18px] text-white'>
            <IoClose size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
