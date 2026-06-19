import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "@constants/colors";

interface SkeletonLoaderProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

// preset — food card skeleton
export function FoodCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <SkeletonLoader width={130} height={90} borderRadius={10} />
      <View style={skeletonStyles.cardBody}>
        <SkeletonLoader width={100} height={12} borderRadius={4} />
        <SkeletonLoader
          width={60}
          height={12}
          borderRadius={4}
          style={{ marginTop: 6 }}
        />
        <SkeletonLoader
          width={80}
          height={28}
          borderRadius={8}
          style={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
}

// preset — category chip skeleton
export function CategoryChipSkeleton() {
  return (
    <View style={skeletonStyles.chip}>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <SkeletonLoader
        width={52}
        height={10}
        borderRadius={4}
        style={{ marginTop: 6 }}
      />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    width: 130,
    marginRight: 12,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 1,
  },
  cardBody: {
    padding: 8,
    gap: 4,
  },
  chip: {
    width: 72,
    alignItems: "center",
    marginRight: 10,
  },
});
