import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useOrderItemsValidation = orderItems => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderItems.length > 0) {
      navigate("/cart");
    }
  }, [orderItems, navigate]);
};

export default useOrderItemsValidation;
