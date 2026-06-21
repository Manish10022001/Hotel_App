import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  readonly?: boolean;
  onRate?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  readonly = true,
  onRate,
  showCount = false,
  count,
}: StarRatingProps) {
  const getStarType = (index: number): "full" | "half" | "empty" => {
    const starNumber = index + 1;
    if (rating >= starNumber) return "full";
    if (rating >= starNumber - 0.5) return "half";
    return "empty";
  };

  const renderStar = (index: number) => {
    const type = getStarType(index);
    const color = type === "empty" ? COLORS.border : COLORS.gold;

    const star = type === "full" ? "★" : type === "half" ? "⯨" : "☆";

    if (readonly) {
      return (
        <Text key={index} style={{ fontSize: size, color }}>
          {star}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onRate?.(index + 1)}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <Text style={{ fontSize: size, color }}>{star}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {Array(maxStars)
          .fill(null)
          .map((_, i) => renderStar(i))}
      </View>
      {showCount && count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 4 }]}>
          {rating.toFixed(1)} ({count})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  count: {
    color: COLORS.gray,
    fontWeight: "500",
  },
});
