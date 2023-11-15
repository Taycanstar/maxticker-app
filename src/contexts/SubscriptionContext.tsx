// SubscriptionContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import api from "../api";
import { URL } from "../constants/api";
import { useDispatch, useSelector } from "react-redux";

type SubscriptionType = "standard" | "plus";

type SubscriptionContextType = {
  subscription: SubscriptionType;
  setSubscription: (type: SubscriptionType) => void;
  fetchSubscription: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a Subscript ionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [subscription, setSubscription] =
    useState<SubscriptionType>("standard");
  const [ws, setWs] = useState<WebSocket | null>(null);

  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const fetchSubscription = async () => {
    try {
      let response = await fetch(`${URL}u/get-subscription/${userId}`);

      if (!response.ok) {
        console.error("Network response not ok, status:", response.status);
        const text = await response.text();
        console.error("Error response body:", text);
        throw new Error(`Network response not ok, status: ${response.status}`);
      }

      let data = await response.json();
      setSubscription(data.subscription);
      console.log("Backend Subscription:", data.subscription);
      console.log("success");
    } catch (error) {
      console.error("Failed fetching subscription data:", error);
    }
  };

  useEffect(() => {
    fetchSubscription(); // Fetch subscription on component mount
  }, []); // The empty dependency array means this useEffect runs once when the component mounts

  return (
    <SubscriptionContext.Provider
      value={{ subscription, setSubscription, fetchSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
