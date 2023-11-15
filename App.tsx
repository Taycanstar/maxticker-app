import { StatusBar } from "expo-status-bar";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./src/store";
import { ThemeContext } from "./src/utils/themeContext";
import { default as customDarkTheme } from "./darkTheme.json";
import { default as customLightTheme } from "./lightTheme.json";
import React, { useState, useContext, useEffect } from "react";
import { TaskProvider } from "./src/contexts/TaskContext";
import { SubscriptionProvider } from "./src/contexts/SubscriptionContext";
import { Appearance, Platform } from "react-native";
import { refreshTokenAction, remoteStart } from "./src/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

if (__DEV__) {
  import("expo-dev-client");
}
import DeviceInfo from "react-native-device-info";
import Initializer from "./src/screens/Initializer";

export default function App() {
  const [theme, setTheme] = useState<string>("dark");
  const [deviceId, setDeviceId] = useState<string>("");

  const toggleTheme = (themeChoice?: string) => {
    if (themeChoice === "system") {
      setTheme(Appearance.getColorScheme() || "light");
    } else if (
      themeChoice === "dark" ||
      (themeChoice === undefined && theme === "light")
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    const setUpPurchases = async () => {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      try {
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey: "appl_rsGwllAosgwUriBuKFFUMSIQqrM",
          });
        }
      } catch (error) {
        console.error("Error setting up Purchases:", error);
      }
    };

    setUpPurchases();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Provider store={store}>
        <SubscriptionProvider>
          <TaskProvider>
            <ApplicationProvider
              {...eva}
              theme={{
                ...eva[theme as keyof typeof eva],
                ...(theme === "light" ? customLightTheme : customDarkTheme),
              }}
            >
              <StatusBar style={theme === "dark" ? "light" : "dark"} />
              <Initializer setDeviceId={setDeviceId} />
              <AppNavigator />
            </ApplicationProvider>
          </TaskProvider>
        </SubscriptionProvider>
      </Provider>
    </ThemeContext.Provider>
  );
}
