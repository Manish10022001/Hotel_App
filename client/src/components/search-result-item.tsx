import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import VegSymbol from "./veg-symbol";
import type { FoodItem } from "src/types/food-item";

interface SearchResultItemProps {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
}

export default function SearchResultItem({
  item,
  onPress,
}: SearchResultItemProps) {
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
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      {/* Image */}
      <View style={styles.imageWrapper}>
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
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <VegSymbol size="small" />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={styles.category}>
          {item.category.emoji} {item.category.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          {item.mrp && item.mrp > item.price && (
            <Text style={styles.mrp}>{formatCurrency(item.mrp)}</Text>
          )}
        </View>
      </View>

      {/* ADD / stepper */}
      <View style={styles.actionWrapper}>
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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 10,
    padding: 12,
    gap: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  // image
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
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
    fontSize: 28,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },

  // info
  info: {
    flex: 1,
    gap: 3,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
  },
  category: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
  },
  description: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  mrp: {
    fontSize: 11,
    color: COLORS.lightGray,
    textDecorationLine: "line-through",
  },

  // add / stepper
  actionWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  addButton: {
    width: 56,
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
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 6,
  },
  stepperBtn: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
    lineHeight: 20,
  },
  stepperCount: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    minWidth: 16,
    textAlign: "center",
  },
});
