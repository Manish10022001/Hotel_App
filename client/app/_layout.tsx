import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@context/auth-context";
import { CartProvider } from "@context/cart-context";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { COLORS } from "src/constants/colors";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().finally(() => {
        setAppReady(true);
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!appReady || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAdminGroup = segments[0] === "(admin)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, isLoading, appReady, segments]);

  if (!appReady) {
    return <View style={{ flex: 1, backgroundColor: COLORS.primary }} />;
  }
  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <AuthGate />
            <Toast />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
