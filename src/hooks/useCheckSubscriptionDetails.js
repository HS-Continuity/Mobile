import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useCheckSubscriptionDetails = subscriptionDetails => {
  const navigate = useNavigate();

  useEffect(() => {
    const isSubscriptionDetailsValid = () => {
      return (
        subscriptionDetails &&
        subscriptionDetails.deliveryCycle &&
        subscriptionDetails.startDate &&
        subscriptionDetails.endDate &&
        subscriptionDetails.deliveryDayOfWeeks &&
        subscriptionDetails.deliveryDayOfWeeks.length > 0
      );
    };

    if (!isSubscriptionDetailsValid()) {
      navigate("/subscription-setup");
    }
  }, [subscriptionDetails, navigate]);
};

export default useCheckSubscriptionDetails;
