import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { getGreeting } from "@utils/date-format";
import { useAuth } from "@context/auth-context";
import BannerCarousel from "@components/banner-carousel";
import CategoryChips from "@components/category-chips";
import FoodItemCard from "@components/food-item-card";
import FloatingCartButton from "@components/floating-cart-button";
import {
  FoodCardSkeleton,
  CategoryChipSkeleton,
} from "@components/skeleton-loader";
import {
  MOCK_BANNERS,
  MOCK_CATEGORIES,
  MOCK_FOOD_ITEMS,
} from "@services/mock-data";
import type { FoodItem } from "src/types/food-item";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    MOCK_CATEGORIES[0].id
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading] = useState(false);

  const featuredItems = MOCK_FOOD_ITEMS.filter((item) => item.isFeatured);
  const bestsellerItems = MOCK_FOOD_ITEMS.filter((item) => item.isBestseller);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // when backend is ready — refetch here
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handleItemPress = (item: FoodItem) => {
    router.push({
      pathname: "/(tabs)/item-detail",
      params: { itemId: item.id },
    });
  };

  const greeting = getGreeting();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Green header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {/* Top row — greeting + bell */}
        <View style={styles.headerTopRow}>
          <Text style={styles.greeting}>
            {greeting}, {firstName}! 👋
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.bellWrapper}>
              <MaterialIcons
                name="notifications-none"
                size={24}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Address row */}
        <TouchableOpacity style={styles.addressRow} activeOpacity={0.7}>
          <MaterialIcons name="location-on" size={16} color={COLORS.white} />
          <Text style={styles.addressText} numberOfLines={1}>
            {user?.addresses?.[0]?.city ?? "Set delivery address"}
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={COLORS.white}
          />
        </TouchableOpacity>

        {/* Search bar — navigates to search screen */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/(tabs)/search")}
          activeOpacity={0.9}
        >
          <MaterialIcons name="search" size={18} color={COLORS.lightGray} />
          <Text style={styles.searchPlaceholder}>Search for dishes...</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Banners */}
        <View style={styles.section}>
          <BannerCarousel banners={MOCK_BANNERS} />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/menu")}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.skeletonRow}>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <CategoryChipSkeleton key={i} />
              ))}
          </View>
        ) : (
          <CategoryChips
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        )}

        {/* Featured dishes */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Featured Dishes 🌟</Text>
        </View>

        {isLoading ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))}
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {featuredItems.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                onPress={handleItemPress}
              />
            ))}
          </ScrollView>
        )}

        {/* Bestsellers */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Bestsellers 🔥</Text>
        </View>

        {isLoading ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))}
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {bestsellerItems.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                onPress={handleItemPress}
              />
            ))}
          </ScrollView>
        )}

        {/* Pure veg banner */}
        <View style={styles.vegBanner}>
          <Text style={styles.vegBannerEmoji}>🌿</Text>
          <View>
            <Text style={styles.vegBannerTitle}>100% Pure Vegetarian</Text>
            <Text style={styles.vegBannerSubtitle}>
              No eggs. No meat. Every single dish.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating cart button */}
      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // header
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
    fontWeight: "500",
  },
  bellWrapper: {
    position: "relative",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },

  // search bar
  searchBar: {
    height: 42,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: COLORS.lightGray,
  },

  // scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },

  // sections
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  skeletonRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },

  // veg banner
  vegBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  vegBannerEmoji: {
    fontSize: 32,
  },
  vegBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  vegBannerSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
});
