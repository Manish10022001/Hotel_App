import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import VegSymbol from "./veg-symbol";
import type { FoodItem } from "src/types/food-item";

interface FoodItemCardProps {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
}

export default function FoodItemCard({ item, onPress }: FoodItemCardProps) {
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } =
    useCart();
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.92}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>🍽️</Text>
          </View>
        )}

        {/* Bestseller badge */}
        {item.isBestseller && (
          <View style={styles.bestsellerBadge}>
            <Text style={styles.bestsellerText}>🔥 Bestseller</Text>
          </View>
        )}

        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>

      {/* Card body */}
      <View style={styles.body}>
        {/* Veg symbol + name */}
        <View style={styles.nameRow}>
          <VegSymbol size="small" />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          {item.mrp && item.mrp > item.price && (
            <Text style={styles.mrp}>{formatCurrency(item.mrp)}</Text>
          )}
        </View>

        {/* ADD button or stepper */}
        {quantity === 0 ? (
          <TouchableOpacity
            style={[
              styles.addButton,
              !item.isAvailable && styles.addButtonDisabled,
            ]}
            onPress={handleAdd}
            disabled={!item.isAvailable}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={handleDecrease}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.stepperButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperCount}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={handleIncrease}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginRight: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
  },

  // image
  imageContainer: {
    height: 100,
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
    fontSize: 32,
  },
  bestsellerBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestsellerText: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: "700",
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },

  // body
  body: {
    padding: 10,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.dark,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  mrp: {
    fontSize: 11,
    color: COLORS.lightGray,
    textDecorationLine: "line-through",
  },

  // add button
  addButton: {
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // stepper
  stepper: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  stepperButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "700",
    lineHeight: 20,
  },
  stepperCount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    minWidth: 20,
    textAlign: "center",
  },
});
