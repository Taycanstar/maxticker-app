import { StatusBar } from "expo-status-bar";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { ThemeContext } from "./src/utils/themeContext";
import { default as customDarkTheme } from "./darkTheme.json";
import { default as customLightTheme } from "./lightTheme.json";
import React, { useState, useContext, useEffect } from "react";
import { TaskProvider } from "./src/contexts/TaskContext";
import { refreshTokenAction } from "./src/store/user";

export default function App() {
  const [theme, setTheme] = useState<string>("light");
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "dark";
    setTheme(nextTheme);
  };

  function startTokenRefreshPolling() {
    // Check every 45 minutes
    const intervalTime = 45 * 60 * 1000;

    setInterval(() => {
      const state = store.getState();
      const tokenExpiry = state.user.tokenExpiry;
      const currentTime = Date.now().valueOf() / 1000; // Convert to seconds

      // If the token is close to expiring (e.g., within 5 minutes), refresh it
      if (tokenExpiry && tokenExpiry - currentTime < 5 * 60) {
        store.dispatch(refreshTokenAction());
      }
    }, intervalTime);
  }
  useEffect(() => {
    startTokenRefreshPolling();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <TaskProvider>
        <ApplicationProvider
          {...eva}
          // theme={{ ...eva.light, ...theme }}

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
    </ThemeContext.Provider>
  );
}
