import { View, Text } from "react-native";
import { COLORS } from "src/constants/colors";

export default function MenuScreen() {
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
        Menu — Day 10
      </Text>
    </View>
  );
}
