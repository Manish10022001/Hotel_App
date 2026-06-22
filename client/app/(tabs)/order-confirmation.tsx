import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { formatCurrency } from "@utils/format-currency";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderNumber, orderId, totalAmount, estimatedTime, orderType } =
    useLocalSearchParams<{
      orderNumber: string;
      orderId: string;
      totalAmount: string;
      estimatedTime: string;
      orderType: string;
    }>();

  // animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // check mark pops in
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // content fades and slides up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isDelivery = orderType === "delivery";
  const total = parseFloat(totalAmount ?? "0");
  const eta = estimatedTime ?? "35";

  const steps = isDelivery
    ? [
        { icon: "check-circle", label: "Order Placed", done: true },
        { icon: "restaurant", label: "Preparing", done: false },
        { icon: "delivery-dining", label: "Out for Delivery", done: false },
        { icon: "home", label: "Delivered", done: false },
      ]
    : [
        { icon: "check-circle", label: "Order Placed", done: true },
        { icon: "restaurant", label: "Preparing", done: false },
        { icon: "table-restaurant", label: "Ready to Serve", done: false },
      ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Green top section */}
      <View style={[styles.topSection, { paddingTop: insets.top + 32 }]}>
        {/* Animated checkmark */}
        <Animated.View
          style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}
        >
          <MaterialIcons name="check" size={52} color={COLORS.primary} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: "center",
          }}
        >
          <Text style={styles.successTitle}>Order Placed! 🎉</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
          <Text style={styles.successSubtitle}>
            {isDelivery
              ? "Your food is being prepared and will be delivered soon"
              : "Your order is being prepared. Please be seated."}
          </Text>
        </Animated.View>
      </View>

      {/* White card content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ETA + total row */}
        <Animated.View
          style={[
            styles.infoRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.infoCard}>
            <MaterialIcons name="schedule" size={22} color={COLORS.primary} />
            <Text style={styles.infoValue}>{eta} min</Text>
            <Text style={styles.infoLabel}>
              {isDelivery ? "Est. Delivery" : "Est. Ready"}
            </Text>
          </View>
          <View style={styles.infoCardDivider} />
          <View style={styles.infoCard}>
            <MaterialIcons name="payments" size={22} color={COLORS.primary} />
            <Text style={styles.infoValue}>{formatCurrency(total)}</Text>
            <Text style={styles.infoLabel}>Total Paid</Text>
          </View>
          <View style={styles.infoCardDivider} />
          <View style={styles.infoCard}>
            <MaterialIcons
              name={isDelivery ? "delivery-dining" : "restaurant"}
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.infoValue}>
              {isDelivery ? "Delivery" : "Dine-In"}
            </Text>
            <Text style={styles.infoLabel}>Order Type</Text>
          </View>
        </Animated.View>

        {/* Order status timeline */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.cardTitle}>Order Status</Text>
          <View style={styles.timeline}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const isCurrent = index === 0;
              return (
                <View key={step.label} style={styles.timelineRow}>
                  {/* Dot + line */}
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        step.done && styles.timelineDotDone,
                        isCurrent && styles.timelineDotCurrent,
                        !step.done && !isCurrent && styles.timelineDotPending,
                      ]}
                    >
                      <MaterialIcons
                        name={step.icon as keyof typeof MaterialIcons.glyphMap}
                        size={14}
                        color={
                          step.done || isCurrent
                            ? COLORS.white
                            : COLORS.lightGray
                        }
                      />
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          step.done && styles.timelineLineDone,
                        ]}
                      />
                    )}
                  </View>

                  {/* Label */}
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        step.done && styles.timelineLabelDone,
                        isCurrent && styles.timelineLabelCurrent,
                        !step.done && !isCurrent && styles.timelineLabelPending,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {isCurrent && (
                      <Text style={styles.timelineSubLabel}>Just now</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* What happens next */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.cardTitle}>What happens next?</Text>
          {isDelivery ? (
            <>
              <View style={styles.nextRow}>
                <Text style={styles.nextEmoji}>👨‍🍳</Text>
                <Text style={styles.nextText}>
                  Our chef will start preparing your order
                </Text>
              </View>
              <View style={styles.nextRow}>
                <Text style={styles.nextEmoji}>🛵</Text>
                <Text style={styles.nextText}>
                  A delivery partner will pick it up and bring it to you
                </Text>
              </View>
              <View style={styles.nextRow}>
                <Text style={styles.nextEmoji}>💰</Text>
                <Text style={styles.nextText}>
                  Pay {formatCurrency(total)} in cash when order arrives
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.nextRow}>
                <Text style={styles.nextEmoji}>🪑</Text>
                <Text style={styles.nextText}>
                  Please be seated at your table
                </Text>
              </View>
              <View style={styles.nextRow}>
                <Text style={styles.nextEmoji}>👨‍🍳</Text>
                <Text style={styles.nextText}>
                  Our chef will prepare your order fresh
                </Text>
              </View>
              <View style={styles.nextRow}>
                <Text style={styles.nextEmoji}>🍽️</Text>
                <Text style={styles.nextText}>
                  Food will be served at your table in ~{eta} minutes
                </Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Pure veg note */}
        <View style={styles.vegNote}>
          <Text style={styles.vegNoteText}>
            🌿 Prepared fresh with pure vegetarian ingredients
          </Text>
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <Animated.View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/order-tracking",
              params: { orderId: orderId ?? "" },
            })
          }
          activeOpacity={0.85}
        >
          <MaterialIcons name="track-changes" size={18} color={COLORS.white} />
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // top section
  topSection: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    opacity: 0.9,
    letterSpacing: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: "hidden",
  },
  successSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // scroll
  scroll: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
  },

  // info row
  infoRow: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  infoCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  infoCardDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
    textAlign: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.lightGray,
    textAlign: "center",
  },

  // card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    minHeight: 52,
  },
  timelineLeft: {
    alignItems: "center",
    width: 28,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineDotDone: {
    backgroundColor: COLORS.primary,
  },
  timelineDotCurrent: {
    backgroundColor: COLORS.primary,
  },
  timelineDotPending: {
    backgroundColor: COLORS.border,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  timelineLineDone: {
    backgroundColor: COLORS.primary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 16,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  timelineLabelDone: {
    color: COLORS.primary,
  },
  timelineLabelCurrent: {
    color: COLORS.primary,
  },
  timelineLabelPending: {
    color: COLORS.lightGray,
  },
  timelineSubLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
    marginTop: 2,
  },

  // what happens next
  nextRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  nextEmoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  nextText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
  },

  // veg note
  vegNote: {
    alignItems: "center",
    paddingVertical: 8,
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
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    // opacity: fadeAnim,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  trackButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  continueButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
