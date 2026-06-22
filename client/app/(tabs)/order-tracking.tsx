import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  RefreshControl,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { formatOrderTime } from "@utils/date-format";
import {
  ORDER_STATUS_CONFIG,
  DELIVERY_STATUS_STEPS,
  DINEIN_STATUS_STEPS,
} from "@constants/order-status";
import { useOrderTracking } from "@hooks/use-order-tracking";
import OrderStatusBadge from "@components/order-status-badge";
import ErrorState from "@components/error-state";
import { SkeletonLoader } from "@components/skeleton-loader";
import type { OrderStatus } from "src/types/order";

// pulse animation for current step
function PulseDot() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.4,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[styles.pulseDot, { transform: [{ scale: pulse }] }]}
    />
  );
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { order, isLoading, error, refresh, simulateNextStatus } =
    useOrderTracking(orderId ?? "");

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.skeletonContainer}>
          <SkeletonLoader width="100%" height={120} borderRadius={14} />
          <SkeletonLoader
            width="100%"
            height={280}
            borderRadius={14}
            style={{ marginTop: 12 }}
          />
          <SkeletonLoader
            width="100%"
            height={160}
            borderRadius={14}
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <View style={{ width: 24 }} />
        </View>
        <ErrorState
          emoji="📦"
          message={error ?? "Order not found."}
          onRetry={refresh}
        />
      </View>
    );
  }

  const isDelivery = order.type === "delivery";
  const statusSteps = isDelivery ? DELIVERY_STATUS_STEPS : DINEIN_STATUS_STEPS;
  const currentStatusIndex = statusSteps.indexOf(order.status);
  const currentConfig = ORDER_STATUS_CONFIG[order.status];
  const isCompleted =
    order.status === "delivered" || order.status === "cancelled";

  const handleCancel = () => {
    if (order.status !== "pending") {
      Alert.alert(
        "Cannot Cancel",
        "Your order is already being prepared and cannot be cancelled.",
        [{ text: "OK" }]
      );
      return;
    }
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No, Keep it", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => {
          // backend integration in Phase 2
          router.back();
        },
      },
    ]);
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Track Order</Text>
          <Text style={styles.headerOrderNumber}>{order.orderNumber}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Current status hero card */}
        <View
          style={[styles.heroCard, { backgroundColor: currentConfig.bgColor }]}
        >
          <View style={styles.heroIconRow}>
            <View
              style={[
                styles.heroIconCircle,
                { backgroundColor: currentConfig.color },
              ]}
            >
              <MaterialIcons
                name={currentConfig.icon as keyof typeof MaterialIcons.glyphMap}
                size={32}
                color={COLORS.white}
              />
            </View>
            {!isCompleted && <PulseDot />}
          </View>

          <Text style={[styles.heroStatus, { color: currentConfig.color }]}>
            {currentConfig.label}
          </Text>
          <Text style={styles.heroDescription}>
            {currentConfig.description}
          </Text>

          {!isCompleted && order.estimatedDeliveryTime && (
            <View style={styles.etaRow}>
              <MaterialIcons
                name="schedule"
                size={14}
                color={currentConfig.color}
              />
              <Text style={[styles.etaText, { color: currentConfig.color }]}>
                Est. {isDelivery ? "delivery" : "ready"} in ~
                {order.estimatedDeliveryTime} min
              </Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Timeline</Text>
          <View style={styles.timeline}>
            {statusSteps.map((status, index) => {
              if (status === "cancelled") return null;
              const isDone = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isLast = index === statusSteps.length - 1;
              const config = ORDER_STATUS_CONFIG[status];
              const historyEntry = order.statusHistory.find(
                (h) => h.status === status
              );

              return (
                <View key={status} style={styles.timelineRow}>
                  {/* Left — dot + line */}
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        isDone
                          ? { backgroundColor: COLORS.primary }
                          : {
                              backgroundColor: COLORS.white,
                              borderWidth: 2,
                              borderColor: COLORS.border,
                            },
                      ]}
                    >
                      {isCurrent && !isCompleted ? (
                        <PulseDot />
                      ) : (
                        <MaterialIcons
                          name={
                            config.icon as keyof typeof MaterialIcons.glyphMap
                          }
                          size={14}
                          color={isDone ? COLORS.white : COLORS.border}
                        />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          isDone && index < currentStatusIndex
                            ? styles.timelineLineDone
                            : styles.timelineLinePending,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right — label + time */}
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isDone
                          ? { color: COLORS.dark, fontWeight: "700" }
                          : { color: COLORS.lightGray, fontWeight: "500" },
                      ]}
                    >
                      {config.label}
                    </Text>
                    {historyEntry && (
                      <Text style={styles.timelineTime}>
                        {formatOrderTime(historyEntry.timestamp)}
                      </Text>
                    )}
                    {isCurrent && !historyEntry && (
                      <Text style={styles.timelineTime}>Just now</Text>
                    )}
                    {config.description && isDone && (
                      <Text style={styles.timelineDescription}>
                        {config.description}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Order summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          {order.items.map((orderItem) => (
            <View key={orderItem.foodItem.id} style={styles.itemRow}>
              <View style={styles.itemQtyBadge}>
                <Text style={styles.itemQtyText}>{orderItem.quantity}x</Text>
              </View>
              <Text style={styles.itemName} numberOfLines={1}>
                {orderItem.name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(orderItem.subtotal)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <MaterialIcons name="payments" size={14} color={COLORS.lightGray} />
            <Text style={styles.paymentText}>
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : order.paymentMethod === "upi"
                  ? "UPI"
                  : "Card"}
            </Text>
          </View>
        </View>

        {/* Delivery address */}
        {isDelivery && order.address && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <View style={styles.addressRow}>
              <MaterialIcons
                name="location-on"
                size={18}
                color={COLORS.primary}
              />
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{order.address.label}</Text>
                <Text style={styles.addressText}>
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state} — {order.address.pincode}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Cancel order — only when pending */}
        {order.status === "pending" && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}

        {/* Dev mode — simulate status */}
        {!isCompleted && (
          <TouchableOpacity
            style={styles.devButton}
            onPress={simulateNextStatus}
          >
            <Text style={styles.devButtonText}>
              🛠 Dev: Advance to next status
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  headerCenter: {
    alignItems: "center",
    gap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },
  headerOrderNumber: {
    fontSize: 11,
    color: COLORS.lightGray,
    fontWeight: "500",
  },

  // skeleton
  skeletonContainer: {
    padding: 16,
  },

  // scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // hero card
  heroCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  heroIconRow: {
    position: "relative",
    marginBottom: 4,
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  heroStatus: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: "center",
  },
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  etaText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // pulse dot
  pulseDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
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
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
  },

  // timeline
  timeline: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 14,
    minHeight: 56,
  },
  timelineLeft: {
    alignItems: "center",
    width: 30,
  },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginVertical: 3,
  },
  timelineLineDone: {
    backgroundColor: COLORS.primary,
  },
  timelineLinePending: {
    backgroundColor: COLORS.border,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 2,
  },
  timelineLabel: {
    fontSize: 14,
  },
  timelineTime: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  timelineDescription: {
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 16,
  },

  // order items
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  itemQtyBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 28,
    alignItems: "center",
  },
  itemQtyText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.dark,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentText: {
    fontSize: 12,
    color: COLORS.lightGray,
  },

  // address
  addressRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  addressInfo: {
    flex: 1,
    gap: 3,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 18,
  },

  // cancel
  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.red,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.red,
  },

  // dev button
  devButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.orangeLight,
    borderWidth: 1,
    borderColor: "#FFCC80",
  },
  devButtonText: {
    fontSize: 13,
    color: COLORS.orange,
    fontWeight: "600",
  },
});
