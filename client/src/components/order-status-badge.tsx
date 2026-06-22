import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ORDER_STATUS_CONFIG } from "@constants/order-status";
import type { OrderStatus } from "../types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "small" | "large";
}

export default function OrderStatusBadge({
  status,
  size = "small",
}: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bgColor },
        isLarge && styles.badgeLarge,
      ]}
    >
      <MaterialIcons
        name={config.icon as keyof typeof MaterialIcons.glyphMap}
        size={isLarge ? 16 : 12}
        color={config.color}
      />
      <Text
        style={[
          styles.label,
          { color: config.color },
          isLarge && styles.labelLarge,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
  labelLarge: {
    fontSize: 13,
  },
});
