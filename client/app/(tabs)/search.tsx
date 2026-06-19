import { View, Text } from "react-native";
import { COLORS } from "@constants/colors";

export default function SearchScreen() {
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
        Search — Day 8
      </Text>
    </View>
  );
}
