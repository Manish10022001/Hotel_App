import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { COLORS } from "@constants/colors";

export default function OrderConfirmationScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ fontSize: 48 }}>🎉</Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: COLORS.dark,
          marginTop: 12,
        }}
      >
        Order Placed!
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: COLORS.primary,
          fontWeight: "600",
          marginTop: 6,
        }}
      >
        {orderNumber}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: COLORS.lightGray,
          marginTop: 4,
        }}
      >
        Full screen — Day 11
      </Text>
    </View>
  );
}
