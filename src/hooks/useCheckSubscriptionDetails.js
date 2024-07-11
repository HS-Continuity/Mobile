import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useCheckSubscriptionDetails = subscriptionDetails => {
  const navigate = useNavigate();

  useEffect(() => {
    const isSubscriptionDetailsValid = () => {
      return (
        subscriptionDetails &&
        subscriptionDetails.frequency &&
        subscriptionDetails.duration &&
        subscriptionDetails.selectedDays &&
        subscriptionDetails.selectedDays.length > 0
      );
    };

    if (!isSubscriptionDetailsValid()) {
      navigate("/cart");
    }
  }, [subscriptionDetails, navigate]);
};

export default useCheckSubscriptionDetails;
