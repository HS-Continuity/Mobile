import axios from "axios";

export const fetchCartItems = async () => {
  const response = await axios.get("http://localhost:3001/cart");
  return response.data;
};

export const updateCartItem = async ({ id, quantity }) => {
  const { data: currentItem } = await axios.get(`http://localhost:3001/cart/${id}`);
  const updatedItem = { ...currentItem, quantity };
  const response = await axios.put(`http://localhost:3001/cart/${id}`, updatedItem);

  return response.data;
};
