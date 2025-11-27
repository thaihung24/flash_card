/**
 * Theme Hook for Dark/Light Mode
 */

import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { COLORS } from "../constants/theme";

interface ThemeColors {
  background: string;
  cardBackground: string;
  primaryText: string;
  secondaryText: string;
  accentColor: string;
  tagBackground: string;
  borderColor: string;
}

const lightTheme: ThemeColors = {
  background: COLORS.gray[50],
  cardBackground: COLORS.white,
  primaryText: COLORS.gray[800],
  secondaryText: COLORS.gray[600],
  accentColor: COLORS.error,
  tagBackground: COLORS.gray[100],
  borderColor: COLORS.gray[200],
};

const darkTheme: ThemeColors = {
  background: "#1a1a1a",
  cardBackground: "#2d2d2d",
  primaryText: COLORS.white,
  secondaryText: COLORS.gray[300],
  accentColor: COLORS.error,
  tagBackground: "rgba(255,255,255,0.1)",
  borderColor: "rgba(255,255,255,0.1)",
};

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  useEffect(() => {
    setIsDark(systemColorScheme === "dark");
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return {
    theme,
    isDark,
    toggleTheme,
  };
};
