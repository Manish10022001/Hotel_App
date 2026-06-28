import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNetworkStatus } from "@hooks/use-network-status";
import { COLORS } from "@constants/colors";

export default function OfflineBanner() {
  const { isConnected } = useNetworkStatus();
  const translateY = useRef(new Animated.Value(-60)).current;
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isConnected) {
      wasOffline.current = true;
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else if (wasOffline.current) {
      Animated.timing(translateY, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  if (isConnected && !wasOffline.current) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY }] },
        !isConnected ? styles.offline : styles.online,
      ]}
    >
      <MaterialIcons
        name={isConnected ? "wifi" : "wifi-off"}
        size={16}
        color={COLORS.white}
      />
      <Text style={styles.text}>
        {isConnected ? "Back online" : "You are offline — showing cached data"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  offline: {
    backgroundColor: "#B71C1C",
  },
  online: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
});
