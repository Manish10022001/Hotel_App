import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";

export default function FloatingCartButton() {
  const router = useRouter();
  const { getItemCount, getItemsTotal } = useCart();
  const translateY = useRef(new Animated.Value(100)).current;

  const count = getItemCount();
  const total = getItemsTotal();

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: count > 0 ? 0 : 100,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [count]);

  if (count === 0) return null;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/cart")}
        activeOpacity={0.9}
      >
        <Text style={styles.left}>
          🛒 {count} {count === 1 ? "item" : "items"}
        </Text>
        <Text style={styles.right}>{formatCurrency(total)} →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 99,
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  left: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  right: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
});
