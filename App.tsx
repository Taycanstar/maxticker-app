import { StatusBar } from "expo-status-bar";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/store";
import { ThemeContext } from "./src/utils/themeContext";
import { default as customDarkTheme } from "./darkTheme.json";
import { default as customLightTheme } from "./lightTheme.json";
import React, { useState, useContext, useEffect } from "react";
import { TaskProvider } from "./src/contexts/TaskContext";
import { SubscriptionProvider } from "./src/contexts/SubscriptionContext";
import { refreshTokenAction } from "./src/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [theme, setTheme] = useState<string>("dark");
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "dark";
    setTheme(nextTheme);
  };

  async function checkStoredToken() {
    // Check if there's a token in AsyncStorage
    const token = await AsyncStorage.getItem("token");
    if (token) {
      // Dispatch a refresh action to handle token validity and refreshing
      store.dispatch(refreshTokenAction());
    }
  }

  function startTokenRefreshPolling() {
    // Check every 45 minutes
    const intervalTime = 50 * 60 * 1000;

    setInterval(() => {
      const state = store.getState();
      const tokenExpiry = state.user.tokenExpiry;
      const currentTime = Date.now().valueOf() / 1000; // Convert to seconds

      // If the token is close to expiring (e.g., within 5 minutes), refresh it
      if (tokenExpiry && tokenExpiry - currentTime <= 10 * 60) {
        store.dispatch(refreshTokenAction());
      }
    }, intervalTime);
  }

  useEffect(() => {
    checkStoredToken();
    startTokenRefreshPolling();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SubscriptionProvider>
        <TaskProvider>
          <ApplicationProvider
            {...eva}
            theme={{
              ...eva[theme as keyof typeof eva],
              ...(theme === "light" ? customLightTheme : customDarkTheme),
            }}
          >
            <Provider store={store}>
              <StatusBar style={theme === "dark" ? "light" : "dark"} />
              <AppNavigator />
            </Provider>
          </ApplicationProvider>
        </TaskProvider>
      </SubscriptionProvider>
    </ThemeContext.Provider>
  );
}
