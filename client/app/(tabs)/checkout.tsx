import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { useCart } from "@context/cart-context";
import { useAuth } from "@context/auth-context";
import { orderService } from "@services/orders";
import { showToast } from "@utils/toast";
import { isApiError, getMessageForCode } from "@utils/error-handler";
import PaymentMethodSelector from "@components/payment-method-selector";
import PriceBreakdown from "@components/price-breakdown";
import type { OrderType, PaymentMethod } from "src/types/order";
import type { CheckoutState } from "src/types/checkout";
import {
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  PACKAGING_CHARGE,
  GST_PERCENTAGE,
} from "@constants/app";

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, getItemsTotal, clearCart } = useCart();
  const { user } = useAuth();

  const defaultAddress =
    user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0];

  const [state, setState] = useState<CheckoutState>({
    orderType: "delivery",
    selectedAddress: defaultAddress ?? null,
    paymentMethod: "cod",
    specialInstructions: "",
    tableNumber: "",
    guestCount: 1,
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const itemsTotal = getItemsTotal();
  const deliveryCharge =
    state.orderType === "delivery" && itemsTotal < FREE_DELIVERY_THRESHOLD
      ? DELIVERY_CHARGE
      : 0;
  const packagingCharge = PACKAGING_CHARGE;
  const gstAmount = Math.round(
    ((itemsTotal + packagingCharge) * GST_PERCENTAGE) / 100
  );
  const totalAmount = itemsTotal + deliveryCharge + packagingCharge + gstAmount;

  const updateState = (patch: Partial<CheckoutState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const handlePlaceOrder = async () => {
    // validations
    if (state.orderType === "delivery" && !state.selectedAddress) {
      showToast.error("Please add a delivery address to continue.");
      return;
    }
    if (items.length === 0) {
      showToast.error("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const order = await orderService.placeOrder(items, {
        orderType: state.orderType,
        address: state.selectedAddress ?? undefined,
        tableNumber: state.tableNumber || undefined,
        guestCount: state.guestCount,
        paymentMethod: state.paymentMethod,
        specialInstructions: state.specialInstructions || undefined,
      });

      clearCart();

      router.replace({
        pathname: "/(tabs)/order-confirmation",
        params: {
          orderNumber: order.orderNumber,
          orderId: order.id,
          totalAmount: String(order.totalAmount),
          estimatedTime: String(order.estimatedDeliveryTime ?? 35),
          orderType: order.type,
        },
      });
    } catch (error) {
      const message = isApiError(error)
        ? getMessageForCode(error.code)
        : "Failed to place order. Please try again.";
      showToast.error(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order type toggle */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Type</Text>
          <View style={styles.toggleRow}>
            {(["delivery", "dinein"] as OrderType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  state.orderType === type && styles.toggleButtonActive,
                ]}
                onPress={() => updateState({ orderType: type })}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    state.orderType === type && styles.toggleButtonTextActive,
                  ]}
                >
                  {type === "delivery" ? "🛵 Delivery" : "🍽️ Dine-In"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Delivery address */}
        {state.orderType === "delivery" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            {state.selectedAddress ? (
              <View style={styles.addressCard}>
                <View style={styles.addressCardLeft}>
                  <View style={styles.addressLabelBadge}>
                    <Text style={styles.addressLabelText}>
                      {state.selectedAddress.label}
                    </Text>
                  </View>
                  <Text style={styles.addressStreet}>
                    {state.selectedAddress.street}
                  </Text>
                  <Text style={styles.addressCity}>
                    {state.selectedAddress.city}, {state.selectedAddress.state}{" "}
                    — {state.selectedAddress.pincode}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    showToast.info("Address management coming in Day 16")
                  }
                >
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() =>
                  showToast.info("Address management coming in Day 16")
                }
              >
                <MaterialIcons
                  name="add-location"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.addAddressText}>Add Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Dine-in details */}
        {state.orderType === "dinein" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dine-In Details</Text>

            <Text style={styles.fieldLabel}>Table Number (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={state.tableNumber}
              onChangeText={(text) => updateState({ tableNumber: text })}
              placeholder="e.g. Table 5"
              placeholderTextColor={COLORS.lightGray}
              keyboardType="default"
            />

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              Number of Guests
            </Text>
            <View style={styles.guestRow}>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() =>
                  updateState({
                    guestCount: Math.max(1, state.guestCount - 1),
                  })
                }
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.guestButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.guestCount}>{state.guestCount}</Text>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() =>
                  updateState({
                    guestCount: Math.min(10, state.guestCount + 1),
                  })
                }
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.guestButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order items summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items ({items.length})</Text>
          {items.map((cartItem) => (
            <View key={cartItem.item.id} style={styles.orderItemRow}>
              <View style={styles.orderItemLeft}>
                <View style={styles.orderItemQtyBadge}>
                  <Text style={styles.orderItemQtyText}>
                    {cartItem.quantity}x
                  </Text>
                </View>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {cartItem.item.name}
                </Text>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatCurrency(cartItem.item.price * cartItem.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Special instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <Text style={styles.fieldHint}>
            Any requests for the kitchen? (optional)
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={state.specialInstructions}
            onChangeText={(text) => updateState({ specialInstructions: text })}
            placeholder="e.g. Less spicy, no onion, extra gravy..."
            placeholderTextColor={COLORS.lightGray}
            multiline
            maxLength={200}
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {state.specialInstructions.length}/200
          </Text>
        </View>

        {/* Payment method */}
        <PaymentMethodSelector
          selected={state.paymentMethod}
          onSelect={(method: PaymentMethod) =>
            updateState({ paymentMethod: method })
          }
        />

        {/* Price breakdown */}
        <View style={styles.gap} />
        <PriceBreakdown itemsTotal={itemsTotal} />

        {/* Pure veg note */}
        <View style={styles.vegNote}>
          <Text style={styles.vegNoteText}>
            🌿 All items are 100% pure vegetarian
          </Text>
        </View>
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            isPlacingOrder && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
          activeOpacity={0.85}
        >
          {isPlacingOrder ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order →</Text>
          )}
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

  // scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },

  // card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 12,
  },

  // order type toggle
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
  },
  toggleButtonTextActive: {
    color: COLORS.white,
  },

  // address
  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  addressCardLeft: {
    flex: 1,
    gap: 4,
  },
  addressLabelBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  addressLabelText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  addressStreet: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
  },
  addressCity: {
    fontSize: 12,
    color: COLORS.gray,
  },
  changeText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    justifyContent: "center",
  },
  addAddressText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // dine-in
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.dark,
  },
  textArea: {
    height: 90,
    paddingTop: 12,
    paddingBottom: 12,
  },
  charCount: {
    fontSize: 11,
    color: COLORS.lightGray,
    textAlign: "right",
    marginTop: 4,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  guestButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  guestButtonText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "700",
    lineHeight: 24,
  },
  guestCount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
    minWidth: 30,
    textAlign: "center",
  },

  // order items
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  orderItemQtyBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 28,
    alignItems: "center",
  },
  orderItemQtyText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  orderItemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: "500",
  },
  orderItemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // gap
  gap: {
    height: 0,
  },

  // veg note
  vegNote: {
    alignItems: "center",
    paddingVertical: 12,
  },
  vegNoteText: {
    fontSize: 12,
    color: COLORS.lightGray,
  },

  // bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    // borderTopWidth: 1,
    // borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  bottomTotal: {
    gap: 2,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  bottomTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },
  placeOrderButton: {
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
  placeOrderButtonDisabled: {
    backgroundColor: "#A5D6A7",
    elevation: 0,
    shadowOpacity: 0,
  },
  placeOrderButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
});
