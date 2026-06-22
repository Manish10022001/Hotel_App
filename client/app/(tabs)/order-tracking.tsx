import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { COLORS } from "@constants/colors";

export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700", color: COLORS.dark }}>
        Order Tracking — Day 12
      </Text>
      <Text style={{ fontSize: 13, color: COLORS.lightGray, marginTop: 6 }}>
        Order ID: {orderId}
      </Text>
    </View>
  );
}
