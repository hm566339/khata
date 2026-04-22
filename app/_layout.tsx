import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "../hooks/use-color-scheme";
import { initializeDatabase } from "../src/database/init";
import { LanguageProvider } from "../src/i18n/LanguageContext";
import "../src/i18n/config";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const initDB = async () => {
      try {
        await initializeDatabase();
        console.log("Database initialized in Expo Router");
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };
    initDB();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="customer-detail"
            options={{ title: "Customer Detail" }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LanguageProvider>
  );
}
