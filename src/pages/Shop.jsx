import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShopStore } from "../stores/useShopStore";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerInfo, fetchCustomerProducts } from "../apis";
import ProductItem from "../components/Product/ProductItem";

const Shop = () => {
  const { customerId } = useParams();
  const { selectedCategory, setSelectedCategory } = useShopStore();

  const { data: sellerInfo, isLoading: isLoadingSellerInfo } = useQuery({
    queryKey: ["sellerInfo", customerId],
    queryFn: () => fetchCustomerInfo(customerId),
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", customerId],
    queryFn: () => fetchCustomerProducts(customerId),
  });

  useEffect(() => {
    setSelectedCategory("전체");
  }, [setSelectedCategory]);

  if (isLoadingSellerInfo || isLoadingProducts) {
    return <div>Loading...</div>;
  }

  const categories = [
    "전체",
    ...new Set(products.map(product => product.product_detail_category_id)),
  ];

  const filteredProducts =
    selectedCategory === "전체"
      ? products
      : products.filter(product => product.product_detail_category_id === selectedCategory);

  return (
    <div className='mx-auto flex min-h-screen max-w-md flex-col bg-white'>
      <main className='flex-grow p-4'>
        {/* 브랜드명 판매자 간단 소개 */}
        <div className='mb-6'>
          <h2 className='mb-2 text-center text-2xl font-bold'>{sellerInfo.name}</h2>
          <p className='text-center text-gray-600'>{sellerInfo.description}</p>
        </div>

        {/* 판매자 사진 */}
        <div className='mb-6 rounded-lg bg-gray-100 p-4'>
          <img
            src={sellerInfo.image}
            alt={sellerInfo.name}
            className='h-40 w-full rounded object-contain'
          />
        </div>

        {/* 카테고리 선택 메뉴바 */}
        <div className='mb-6 overflow-x-auto'>
          <div className='flex space-x-2 whitespace-nowrap'>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn btn-sm ${
                  selectedCategory === category ? "btn-primary" : "btn-ghost"
                }`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 상품 목록 */}
        <div className='grid grid-cols-2 gap-4'>
          {filteredProducts.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
