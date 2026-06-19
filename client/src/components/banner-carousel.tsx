import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BANNER_AUTO_SCROLL_MS } from "@constants/app";
import { COLORS } from "@constants/colors";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 32;

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUserScrolling = useRef(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      if (isUserScrolling.current) return;
      const nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, BANNER_AUTO_SCROLL_MS);

    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 12}
        decelerationRate="fast"
        onScrollBeginDrag={() => {
          isUserScrolling.current = true;
        }}
        onScrollEndDrag={() => {
          isUserScrolling.current = false;
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / (BANNER_WIDTH + 12)
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.92} style={styles.bannerWrapper}>
            <LinearGradient
              colors={[item.bgColor, COLORS.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {banners.map((_, index) => {
          const inputRange = [
            (index - 1) * (BANNER_WIDTH + 12),
            index * (BANNER_WIDTH + 12),
            (index + 1) * (BANNER_WIDTH + 12),
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 22, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
  },
  banner: {
    height: 96,
    borderRadius: 14,
    padding: 16,
    justifyContent: "center",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.85,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
