import { View, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";

interface VegSymbolProps {
  size?: "small" | "medium";
}

export default function VegSymbol({ size = "small" }: VegSymbolProps) {
  const boxSize = size === "small" ? 14 : 18;
  const dotSize = size === "small" ? 6 : 8;

  return (
    <View
      style={[
        styles.box,
        {
          width: boxSize,
          height: boxSize,
          borderRadius: 2,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderColor: COLORS.vegGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    backgroundColor: COLORS.vegGreen,
  },
});
