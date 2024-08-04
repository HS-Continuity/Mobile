import { Link, useLocation } from "react-router-dom";

const CategoryNav = ({ categories }) => {
  const location = useLocation();

  return (
    <nav className='main-container w-full border-b border-gray-200'>
      <ul className='flex w-full justify-between'>
        {categories.map(category => (
          <li key={category.path} className='flex-1'>
            <Link
              to={category.path}
              className={`flex h-full w-full items-center justify-center px-1 py-3 text-sm font-semibold ${
                location.pathname === category.path
                  ? "border-b-2 border-[#00835F] text-[#00835F]"
                  : "text-gray-500 hover:text-[#00835F]"
              }`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
