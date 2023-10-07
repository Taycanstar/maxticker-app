// SubscriptionContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import api from "../api";

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
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [subscription, setSubscription] =
    useState<SubscriptionType>("standard");

  const fetchSubscription = async () => {
    try {
      // Make the API call (replace with your endpoint and authentication headers if needed)
      let response = await fetch(`${api}/u/get-subscription`);
      if (!response.ok) throw new Error("Network response not ok");

      let data = await response.json();
      setSubscription(data.subscription); // assuming the returned object has a 'subscription' key
      console.log("success");
    } catch (error) {
      console.error("Failed fetching subscription data: ", error);
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
