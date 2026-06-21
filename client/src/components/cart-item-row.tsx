import { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import VegSymbol from "./veg-symbol";
import type { FoodItem } from "src/types/food-item";

interface CartItemRowProps {
  item: FoodItem;
  quantity: number;
}

export default function CartItemRow({ item, quantity }: CartItemRowProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleIncrease = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      handleRemove();
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    Alert.alert("Remove Item", `Remove ${item.name} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          // slide out animation then remove
          Animated.timing(slideAnim, {
            toValue: -400,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            removeFromCart(item.id);
          });
        },
      },
    ]);
  };

  const subtotal = item.price * quantity;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      {/* Image */}
      <View style={styles.imageWrapper}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            placeholder={require("assets/images/adaptive-icon.jpg")}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderEmoji}>🍽️</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <VegSymbol size="small" />
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        <Text style={styles.unitPrice}>
          {formatCurrency(item.price)} per item
        </Text>
        <Text style={styles.subtotal}>{formatCurrency(subtotal)}</Text>
      </View>

      {/* Right side — stepper + delete */}
      <View style={styles.rightSide}>
        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleRemove}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <MaterialIcons
            name="delete-outline"
            size={18}
            color={COLORS.lightGray}
          />
        </TouchableOpacity>

        {/* Stepper */}
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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  // image
  imageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: "hidden",
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

  // info
  info: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
    lineHeight: 20,
  },
  unitPrice: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // right side
  rightSide: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  deleteButton: {
    padding: 4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 3,
    gap: 6,
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
    minWidth: 18,
    textAlign: "center",
  },
});
