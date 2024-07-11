import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useOrderItemsValidation = orderItems => {
  const navigate = useNavigate();

  useEffect(() => {
    const isOrderItemsValid = () => {
      return orderItems.length > 0;
    };

    if (!isOrderItemsValid()) {
      navigate("/cart");
    }
  }, [orderItems, navigate]);
};

export default useOrderItemsValidation;
