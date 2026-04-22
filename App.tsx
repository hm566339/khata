import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "./src/constants";
import { initializeDatabase } from "./src/database/init";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Initializing database...");
        await initializeDatabase();
        console.log("Database initialized successfully");
        setDbReady(true);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError("Failed to initialize app. Please restart.");
      }
    };

    initializeApp();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  errorContent: {
    padding: 20,
    backgroundColor: COLORS.errorLight,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
  },
});
