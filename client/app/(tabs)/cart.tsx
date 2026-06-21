import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { COLORS } from "@constants/colors";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import CartItemRow from "@components/cart-item-row";
import PriceBreakdown from "@components/price-breakdown";
import {
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  PACKAGING_CHARGE,
  GST_PERCENTAGE,
} from "@constants/app";

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, getItemsTotal } = useCart();

  const itemsTotal = getItemsTotal();
  const deliveryCharge =
    itemsTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const packagingCharge = PACKAGING_CHARGE;
  const gstAmount = Math.round(
    ((itemsTotal + packagingCharge) * GST_PERCENTAGE) / 100
  );
  const totalAmount = itemsTotal + deliveryCharge + packagingCharge + gstAmount;

  // empty cart
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Empty state */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our menu and add your favourite dishes
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          My Cart <Text style={styles.headerCount}>({items.length} items)</Text>
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(cartItem) => cartItem.item.id}
        renderItem={({ item: cartItem }) => (
          <CartItemRow item={cartItem.item} quantity={cartItem.quantity} />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.footer}>
            {/* Coupon placeholder */}
            <TouchableOpacity style={styles.couponRow}>
              <View style={styles.couponLeft}>
                <MaterialIcons
                  name="local-offer"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.couponText}>Apply Coupon</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={COLORS.lightGray}
              />
            </TouchableOpacity>

            <View style={styles.gap} />

            {/* Price breakdown */}
            <PriceBreakdown itemsTotal={itemsTotal} />

            {/* Pure veg note */}
            <View style={styles.vegNote}>
              <Text style={styles.vegNoteText}>
                🌿 All items are 100% pure vegetarian
              </Text>
            </View>
          </View>
        }
      />

      {/* Fixed bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarTotal}>
          <Text style={styles.bottomBarTotalLabel}>Total</Text>
          <Text style={styles.bottomBarTotalValue}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push("/(tabs)/checkout")}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout →</Text>
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
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.lightGray,
  },

  // list
  listContent: {
    padding: 16,
  },
  footer: {
    gap: 0,
  },
  gap: {
    height: 12,
  },

  // coupon
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  couponLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  couponText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // veg note
  vegNote: {
    alignItems: "center",
    paddingVertical: 16,
  },
  vegNoteText: {
    fontSize: 12,
    color: COLORS.lightGray,
  },

  // empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 22,
  },
  browseButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },

  // bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  bottomBarTotal: {
    gap: 2,
  },
  bottomBarTotalLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  bottomBarTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },
  checkoutButton: {
    flex: 1,
    height: 50,
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
  checkoutButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
});
