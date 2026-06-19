import { View, Text } from "react-native";
import { COLORS } from "@constants/colors";

export default function CartScreen() {
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
        Cart — Day 9
      </Text>
    </View>
  );
}
