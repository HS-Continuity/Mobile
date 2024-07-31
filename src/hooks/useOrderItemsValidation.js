import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useOrderItemsValidation = groupedItems => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!groupedItems || Object.keys(groupedItems).length === 0) {
      navigate("/cart");
    }
  }, [groupedItems, navigate]);
};

export default useOrderItemsValidation;
