import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import VegSymbol from "@components/veg-symbol";
import FloatingCartButton from "@components/floating-cart-button";
import { MOCK_CATEGORIES, MOCK_FOOD_ITEMS } from "@services/mock-data";
import type { Category, FoodItem } from "src/types/food-item";

interface MenuSection {
  category: Category;
  data: FoodItem[];
}

// build sections from mock data
const MENU_SECTIONS: MenuSection[] = MOCK_CATEGORIES.map((category) => ({
  category,
  data: MOCK_FOOD_ITEMS.filter((item) => item.category.id === category.id),
})).filter((section) => section.data.length > 0);

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sectionListRef = useRef<SectionList>(null);
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } =
    useCart();

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    MENU_SECTIONS[0]?.category.id ?? ""
  );

  const handleCategorySelect = (categoryId: string, sectionIndex: number) => {
    setSelectedCategoryId(categoryId);
    sectionListRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      animated: true,
      viewOffset: 48,
    });
  };

  const handleItemPress = (item: FoodItem) => {
    router.push({
      pathname: "/(tabs)/item-detail",
      params: { itemId: item.id },
    });
  };

  const renderSectionHeader = useCallback(
    ({ section }: { section: MenuSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{section.category.emoji}</Text>
        <Text style={styles.sectionTitle}>{section.category.name}</Text>
        <Text style={styles.sectionCount}>{section.data.length} items</Text>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: FoodItem }) => {
      const quantity = getItemQuantity(item.id);

      const handleAdd = () => {
        if (!item.isAvailable) return;
        addToCart(item);
      };
      const handleIncrease = () => updateQuantity(item.id, quantity + 1);
      const handleDecrease = () => {
        if (quantity === 1) removeFromCart(item.id);
        else updateQuantity(item.id, quantity - 1);
      };

      return (
        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.8}
        >
          {/* Info */}
          <View style={styles.itemInfo}>
            <View style={styles.itemNameRow}>
              <VegSymbol size="small" />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            {item.isBestseller && (
              <View style={styles.bestsellerChip}>
                <Text style={styles.bestsellerChipText}>🔥 Bestseller</Text>
              </View>
            )}
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.itemBottomRow}>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              {item.mrp && item.mrp > item.price && (
                <Text style={styles.itemMrp}>{formatCurrency(item.mrp)}</Text>
              )}
              <View style={styles.prepTimeRow}>
                <MaterialIcons
                  name="schedule"
                  size={11}
                  color={COLORS.lightGray}
                />
                <Text style={styles.prepTimeText}>{item.prepTime} min</Text>
              </View>
            </View>
          </View>

          {/* Image + button */}
          <View style={styles.itemRight}>
            <View style={styles.itemImageWrapper}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.itemImagePlaceholder}>
                  <Text style={styles.itemImageEmoji}>🍽️</Text>
                </View>
              )}
              {!item.isAvailable && (
                <View style={styles.unavailableOverlay}>
                  <Text style={styles.unavailableText}>NA</Text>
                </View>
              )}
            </View>

            {/* ADD / stepper */}
            {quantity === 0 ? (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !item.isAvailable && styles.addButtonDisabled,
                ]}
                onPress={handleAdd}
                disabled={!item.isAvailable}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={handleDecrease}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.stepperBtn}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperCount}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handleIncrease}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.stepperBtn}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [getItemQuantity, addToCart, removeFromCart, updateQuantity]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Our Menu</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/search" as never)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="search" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* Category filter chips */}
      <View style={styles.chipsWrapper}>
        <SectionList
          horizontal
          sections={[{ title: "", data: [] }]}
          renderItem={() => null}
          ListHeaderComponent={
            <View style={styles.chipsRow}>
              {MENU_SECTIONS.map((section, index) => {
                const isSelected = selectedCategoryId === section.category.id;
                return (
                  <TouchableOpacity
                    key={section.category.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() =>
                      handleCategorySelect(section.category.id, index)
                    }
                  >
                    <Text style={styles.chipEmoji}>
                      {section.category.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.chipLabel,
                        isSelected && styles.chipLabelSelected,
                      ]}
                    >
                      {section.category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          }
          keyExtractor={(_, index) => String(index)}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Menu SectionList */}
      <SectionList
        ref={sectionListRef}
        sections={MENU_SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        onViewableItemsChanged={({ viewableItems }) => {
          const firstSection = viewableItems.find(
            (item) => item.isViewable && item.section
          );
          if (firstSection?.section) {
            const section = firstSection.section as MenuSection;
            setSelectedCategoryId(section.category.id);
          }
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
      />

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
  },

  // chips
  chipsWrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray,
  },
  chipLabelSelected: {
    color: COLORS.white,
  },

  // list
  listContent: {
    paddingTop: 4,
  },

  // section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
    flex: 1,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.lightGray,
  },

  // item row
  itemRow: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 5,
  },
  itemNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
  },
  bestsellerChip: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.orangeLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bestsellerChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.orange,
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.lightGray,
    lineHeight: 17,
  },
  itemBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  itemMrp: {
    fontSize: 12,
    color: COLORS.lightGray,
    textDecorationLine: "line-through",
  },
  prepTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: "auto",
  },
  prepTimeText: {
    fontSize: 11,
    color: COLORS.lightGray,
  },

  // item right
  itemRight: {
    alignItems: "center",
    gap: 8,
    width: 90,
  },
  itemImageWrapper: {
    width: 88,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  itemImageEmoji: {
    fontSize: 26,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },

  // add / stepper
  addButton: {
    width: 72,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 8,
    width: 72,
    justifyContent: "space-between",
  },
  stepperBtn: {
    fontSize: 17,
    color: COLORS.primary,
    fontWeight: "700",
    lineHeight: 21,
  },
  stepperCount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    minWidth: 16,
  },
});
