import React, {
  createContext,
  FunctionComponent,
  useState,
  useContext,
} from "react";

import { Appearance } from "react-native";

type ThemeContextType = {
  theme: string;

  toggleTheme: (themeChoice?: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider: FunctionComponent<Props> = ({ children }) => {
  const [theme, setTheme] = useState<string>("light");

  const toggleTheme = (themeChoice?: string) => {
    if (themeChoice === "system") {
      setTheme(Appearance.getColorScheme() || "light");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
