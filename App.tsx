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
// import { ScrollPositionProvider } from "./src/contexts/ScrollContext";
import { refreshTokenAction } from "./src/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [theme, setTheme] = useState<string>("dark");
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SubscriptionProvider>
        {/* <ScrollPositionProvider> */}
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
        {/* </ScrollPositionProvider> */}
      </SubscriptionProvider>
    </ThemeContext.Provider>
  );
}
