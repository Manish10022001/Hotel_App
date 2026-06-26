import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { orderService } from "src/services/orders";
import { useCart } from "src/context/cart-context";
import { showToast } from "@utils/toast";
import OrderCard from "@components/order-card";
import { SkeletonLoader } from "@components/skeleton-loader";
import type { Order } from "src/types/order";

type OrderTab = "current" | "past";

function OrdersEmptyState({
  tab,
  onBrowse,
}: {
  tab: OrderTab;
  onBrowse: () => void;
}) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{tab === "current" ? "🛵" : "📋"}</Text>
      <Text style={styles.emptyTitle}>
        {tab === "current" ? "No active orders" : "No past orders"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {tab === "current"
          ? "Orders you place will appear here while they are being prepared"
          : "Your completed and cancelled orders will appear here"}
      </Text>
      {tab === "current" && (
        <TouchableOpacity style={styles.browseButton} onPress={onBrowse}>
          <Text style={styles.browseButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function OrderSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTopRow}>
        <View style={{ gap: 6 }}>
          <SkeletonLoader width={140} height={14} borderRadius={4} />
          <SkeletonLoader width={100} height={11} borderRadius={4} />
        </View>
        <SkeletonLoader width={80} height={24} borderRadius={6} />
      </View>
      <SkeletonLoader
        width="100%"
        height={1}
        borderRadius={0}
        style={{ marginVertical: 10 }}
      />
      <SkeletonLoader width={200} height={13} borderRadius={4} />
      <SkeletonLoader
        width="100%"
        height={1}
        borderRadius={0}
        style={{ marginVertical: 10 }}
      />
      <View style={styles.skeletonBottomRow}>
        <SkeletonLoader width={60} height={20} borderRadius={4} />
        <SkeletonLoader width={120} height={32} borderRadius={8} />
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>("current");

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const result = await orderService.getOrders();
      setOrders(result);
    } catch {
      showToast.error("Could not load orders. Pull down to refresh.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // refresh every time tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(true);
  };

  const currentOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );
  const pastOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );
  const displayedOrders = activeTab === "current" ? currentOrders : pastOrders;

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "/(tabs)/order-detail",
      params: { orderId: order.id },
    });
  };

  const handleTrack = (order: Order) => {
    router.push({
      pathname: "/(tabs)/order-tracking",
      params: { orderId: order.id },
    });
  };

  const handleReorder = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((orderItem) => {
      if (orderItem.foodItem.isAvailable) {
        addToCart(orderItem.foodItem);
        addedCount++;
      }
    });
    const skippedCount = order.items.length - addedCount;
    if (addedCount > 0) {
      showToast.success(
        skippedCount > 0
          ? `${addedCount} items added. ${skippedCount} unavailable items skipped.`
          : `${addedCount} items added to cart!`
      );
      router.push("/(tabs)/cart" as never);
    } else {
      showToast.error("All items from this order are currently unavailable.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>My Orders</Text>
        {orders.length > 0 && (
          <TouchableOpacity
            onPress={() => fetchOrders()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="refresh" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(["current", "past"] as OrderTab[]).map((tab) => {
          const count =
            tab === "current" ? currentOrders.length : pastOrders.length;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === "current" ? "Current" : "Past"}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === tab && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === tab && styles.tabBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.skeletonList}>
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
        </View>
      ) : (
        <FlatList
          data={displayedOrders}
          keyExtractor={(order) => order.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={handleOrderPress}
              onTrack={handleTrack}
              onReorder={handleReorder}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            displayedOrders.length === 0 && styles.listContentEmpty,
            { paddingBottom: insets.bottom + 20 },
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
          ListEmptyComponent={
            <OrdersEmptyState
              tab={activeTab}
              onBrowse={() => router.push("/(tabs)/menu" as never)}
            />
          }
        />
      )}
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

  // tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.gray,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabBadge: {
    backgroundColor: COLORS.border,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.gray,
  },
  tabBadgeTextActive: {
    color: COLORS.white,
  },

  // list
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flexGrow: 1,
  },

  // skeleton
  skeletonList: {
    padding: 16,
    gap: 12,
  },
  skeletonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 4,
  },
  skeletonTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  skeletonBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  // empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 20,
  },
  browseButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
});
