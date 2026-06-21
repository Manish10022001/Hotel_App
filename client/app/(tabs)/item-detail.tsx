import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Share,
  TextInput,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import VegSymbol from "@components/veg-symbol";
import StarRating from "@components/star-rating";
import ErrorState from "@components/error-state";
import { MOCK_FOOD_ITEMS } from "@services/mock-data";
import type { FoodItem } from "src/types/food-item";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 280;

function getPopularityLabel(ratingCount: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (ratingCount >= 200)
    return { label: "🔥 Highly Ordered", color: "#B71C1C", bg: "#FFEBEE" };
  if (ratingCount >= 80)
    return { label: "⭐ Moderately Ordered", color: "#E65100", bg: "#FFF3E0" };
  return { label: "🆕 New", color: "#1565C0", bg: "#E3F2FD" };
}

export default function ItemDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } =
    useCart();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [cookingRequest, setCookingRequest] = useState("");
  const [showCookingInput, setShowCookingInput] = useState(false);

  const item: FoodItem | undefined = MOCK_FOOD_ITEMS.find(
    (f) => f.id === itemId
  );

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ErrorState
          emoji="🍽️"
          message="This dish could not be found."
          onRetry={() => router.back()}
        />
      </View>
    );
  }

  const quantity = getItemQuantity(item.id);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addToCart(item);
  };

  const handleIncrease = () => updateQuantity(item.id, quantity + 1);
  const handleDecrease = () => {
    if (quantity === 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const handleShare = async () => {
    await Share.share({
      message: `Check out ${item.name} at Meera Hotel — ${formatCurrency(item.price)}! Pure vegetarian food.`,
      title: item.name,
    });
  };

  const hasDiscount = item.mrp !== undefined && item.mrp > item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.mrp! - item.price) / item.mrp!) * 100)
    : 0;

  const popularity = getPopularityLabel(item.ratingCount);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Hero image — full cover, no cropping */}
      <View style={[styles.imageContainer, { height: IMAGE_HEIGHT }]}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>🍽️</Text>
          </View>
        )}

        {/* Subtle dark gradient only at very top for icon visibility */}
        <View
          style={[styles.topGradient, { height: insets.top + 56 }]}
          pointerEvents="none"
        />

        {/* Back button — small and tight */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 8 }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>

        {/* Top right — bookmark + share */}
        <View style={[styles.topRightActions, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsBookmarked(!isBookmarked)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons
              name={isBookmarked ? "bookmark" : "bookmark-border"}
              size={20}
              color={isBookmarked ? COLORS.gold : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="share" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Discount badge — bottom right of image, clearly visible */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        )}

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          </View>
        )}
      </View>

      {/* Scrollable white card — overlaps image */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Popularity indicator */}
          <View
            style={[styles.popularityBadge, { backgroundColor: popularity.bg }]}
          >
            <Text style={[styles.popularityText, { color: popularity.color }]}>
              {popularity.label}
            </Text>
          </View>

          {/* Name */}
          <View style={styles.nameRow}>
            <VegSymbol size="medium" />
            <Text style={styles.itemName}>{item.name}</Text>
          </View>

          {/* Chips */}
          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {item.category.emoji} {item.category.name}
              </Text>
            </View>
            <View style={styles.chip}>
              <MaterialIcons name="schedule" size={12} color={COLORS.primary} />
              <Text style={styles.chipText}>{item.prepTime} min</Text>
            </View>
            {item.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.mrp}>{formatCurrency(item.mrp!)}</Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>
                    Save {formatCurrency(item.mrp! - item.price)}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>About this dish</Text>
            <Text style={styles.description}>
              {isDescriptionExpanded
                ? item.description
                : item.description.length > 120
                  ? item.description.slice(0, 120) + "..."
                  : item.description}
            </Text>
            {item.description.length > 120 && (
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <Text style={styles.readMore}>
                  {isDescriptionExpanded ? "Read Less ↑" : "Read More ↓"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          {/* Add-ons placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Add-ons</Text>
            <Text style={styles.addOnNote}>
              Customise your order with extras
            </Text>
            {[
              { name: "Extra Butter", price: 10 },
              { name: "Extra Gravy", price: 15 },
              { name: "Papad", price: 20 },
            ].map((addon) => (
              <View key={addon.name} style={styles.addonRow}>
                <View style={styles.addonLeft}>
                  <VegSymbol size="small" />
                  <Text style={styles.addonName}>{addon.name}</Text>
                </View>
                <Text style={styles.addonPrice}>
                  + {formatCurrency(addon.price)}
                </Text>
                <TouchableOpacity style={styles.addonAdd}>
                  <Text style={styles.addonAddText}>ADD</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Cooking request */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.cookingRequestToggle}
              onPress={() => setShowCookingInput(!showCookingInput)}
            >
              <View style={styles.cookingRequestLeft}>
                <MaterialIcons
                  name="restaurant"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.cookingRequestLabel}>
                  Add a cooking request
                </Text>
                <Text style={styles.cookingRequestOptional}>(optional)</Text>
              </View>
              <MaterialIcons
                name={
                  showCookingInput ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={22}
                color={COLORS.lightGray}
              />
            </TouchableOpacity>

            {showCookingInput && (
              <TextInput
                style={styles.cookingInput}
                value={cookingRequest}
                onChangeText={setCookingRequest}
                placeholder="e.g. Less spicy, no onion, extra gravy..."
                placeholderTextColor={COLORS.lightGray}
                multiline
                maxLength={200}
                numberOfLines={3}
                textAlignVertical="top"
              />
            )}
          </View>

          <View style={styles.divider} />

          {/* Ratings */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Ratings & Reviews</Text>
            <View style={styles.ratingsRow}>
              <Text style={styles.ratingNumber}>{item.rating.toFixed(1)}</Text>
              <View style={styles.ratingRight}>
                <StarRating rating={item.rating} size={18} readonly />
                <Text style={styles.ratingCount}>
                  {item.ratingCount} reviews
                </Text>
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>P</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>Priya S.</Text>
                  <StarRating rating={5} size={12} readonly />
                </View>
                <Text style={styles.reviewDate}>2 days ago</Text>
              </View>
              <Text style={styles.reviewComment}>
                Absolutely delicious! The flavours are authentic and portion
                size is generous.
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>A</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>Amit K.</Text>
                  <StarRating rating={4} size={12} readonly />
                </View>
                <Text style={styles.reviewDate}>1 week ago</Text>
              </View>
              <Text style={styles.reviewComment}>
                Very tasty and fresh. Delivered hot. Will order again!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom bar — tight, no extra space */}
      <View style={styles.bottomBar}>
        {quantity > 0 && (
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={handleDecrease}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.stepperButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperCount}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={handleIncrease}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            !item.isAvailable && styles.addButtonDisabled,
          ]}
          onPress={handleAdd}
          disabled={!item.isAvailable || quantity > 0}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>
            {!item.isAvailable
              ? "Currently Unavailable"
              : quantity > 0
                ? `In Cart — ${formatCurrency(item.price * quantity)}`
                : `Add to Cart — ${formatCurrency(item.price)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // image
  imageContainer: {
    width: SCREEN_WIDTH,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderEmoji: {
    fontSize: 64,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  // back button — small circle
  backButton: {
    position: "absolute",
    left: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "center",
    alignItems: "center",
  },

  // top right icons
  topRightActions: {
    position: "absolute",
    right: 14,
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "center",
    alignItems: "center",
  },

  // discount badge — bottom right, green so it stands out
  discountBadge: {
    position: "absolute",
    bottom: 38,
    right: 14,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  // unavailable
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  // scroll
  scroll: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: {},

  // white card
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  // popularity
  popularityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  popularityText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // name
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
  },

  // chips
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // price
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
  },
  mrp: {
    fontSize: 15,
    color: COLORS.lightGray,
    textDecorationLine: "line-through",
  },
  saveBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saveText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
  },

  // divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  // section
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 2,
  },

  // description
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // add-ons
  addOnNote: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 4,
  },
  addonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  addonLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addonName: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: "500",
  },
  addonPrice: {
    fontSize: 13,
    color: COLORS.gray,
  },
  addonAdd: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  addonAddText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // cooking request
  cookingRequestToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cookingRequestLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cookingRequestLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
  },
  cookingRequestOptional: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
  cookingInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.dark,
    backgroundColor: COLORS.background,
    minHeight: 80,
    marginTop: 4,
  },

  // ratings
  ratingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.dark,
  },
  ratingRight: {
    gap: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  reviewName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  reviewComment: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
  },

  // bottom bar — tight
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    padding: 4,
    gap: 8,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "700",
    lineHeight: 22,
  },
  stepperCount: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    minWidth: 20,
    textAlign: "center",
  },
  addButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
});
