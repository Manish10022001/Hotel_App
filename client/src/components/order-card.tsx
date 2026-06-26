import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";
import { formatOrderDate, formatOrderTime, timeAgo } from "@utils/date-format";
import OrderStatusBadge from "./order-status-badge";
import type { Order } from "../types/order";

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
  onTrack?: (order: Order) => void;
  onReorder?: (order: Order) => void;
}

export default function OrderCard({
  order,
  onPress,
  onTrack,
  onReorder,
}: OrderCardProps) {
  const isActive = order.status !== "delivered" && order.status !== "cancelled";

  // show first 2 items then +N more
  const visibleItems = order.items.slice(0, 2);
  const remainingCount = order.items.length - 2;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(order)}
      activeOpacity={0.85}
    >
      {/* Top row — order number + date */}
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            {formatOrderDate(order.createdAt)} •{" "}
            {formatOrderTime(order.createdAt)}
          </Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <View style={styles.divider} />

      {/* Items preview */}
      <View style={styles.itemsRow}>
        <MaterialIcons
          name="restaurant-menu"
          size={14}
          color={COLORS.lightGray}
        />
        <Text style={styles.itemsText} numberOfLines={1}>
          {visibleItems.map((i) => i.name).join(", ")}
          {remainingCount > 0 && (
            <Text style={styles.moreText}> +{remainingCount} more</Text>
          )}
        </Text>
      </View>

      {/* Order type + time ago */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialIcons
            name={order.type === "delivery" ? "delivery-dining" : "restaurant"}
            size={13}
            color={COLORS.lightGray}
          />
          <Text style={styles.metaText}>
            {order.type === "delivery" ? "Delivery" : "Dine-In"}
          </Text>
        </View>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{timeAgo(order.createdAt)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Bottom row — total + actions */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          {isActive && onTrack && (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => onTrack(order)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <MaterialIcons
                name="track-changes"
                size={14}
                color={COLORS.white}
              />
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          )}
          {!isActive && order.status === "delivered" && onReorder && (
            <TouchableOpacity
              style={styles.reorderButton}
              onPress={() => onReorder(order)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <MaterialIcons name="replay" size={14} color={COLORS.primary} />
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => onPress(order)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    gap: 10,
  },

  // top
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topLeft: {
    gap: 3,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: 0.3,
  },
  orderDate: {
    fontSize: 11,
    color: COLORS.lightGray,
  },

  // divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // items
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray,
  },
  moreText: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  metaDot: {
    fontSize: 11,
    color: COLORS.border,
  },

  // bottom
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // track button
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },

  // reorder button
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // details button
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
