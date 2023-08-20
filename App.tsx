import { StatusBar } from "expo-status-bar";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { ThemeContext } from "./src/utils/themeContext";
import { default as customDarkTheme } from "./darkTheme.json";
import { default as customLightTheme } from "./lightTheme.json";
import React, { useState, useContext } from "react";

export default function App() {
  const [theme, setTheme] = useState<string>("dark");
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ApplicationProvider
        {...eva}
        // theme={{ ...eva.light, ...theme }}

        theme={{
          ...eva[theme as keyof typeof eva],
          ...(theme === "light" ? customLightTheme : customDarkTheme),
        }}
      >
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
}
