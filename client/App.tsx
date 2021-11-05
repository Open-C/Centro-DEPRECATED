import React from "react";

import "./global";

import { Platform, UIManager, LogBox } from "react-native";
import { useCachedResources } from "./hooks/useCachedResources";
import { useColorScheme } from "./hooks/useColorScheme";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "./navigation";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs([
  "Warning: The provided value 'moz",
  "Warning: The provided value 'ms-stream",
]);

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
