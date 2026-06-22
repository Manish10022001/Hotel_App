import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import type { PaymentMethod } from "../types/order";

interface PaymentOption {
  method: PaymentMethod;
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  enabled: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    method: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "payments",
    enabled: true,
  },
  {
    method: "upi",
    label: "UPI",
    description: "GPay, PhonePe, Paytm",
    icon: "account-balance",
    enabled: false,
  },
  {
    method: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Rupay",
    icon: "credit-card",
    enabled: false,
  },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      {PAYMENT_OPTIONS.map((option) => {
        const isSelected = selected === option.method;
        return (
          <TouchableOpacity
            key={option.method}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              !option.enabled && styles.optionDisabled,
            ]}
            onPress={() => option.enabled && onSelect(option.method)}
            activeOpacity={option.enabled ? 0.8 : 1}
          >
            {/* Radio */}
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>

            {/* Icon */}
            <MaterialIcons
              name={option.icon}
              size={22}
              color={
                !option.enabled
                  ? COLORS.lightGray
                  : isSelected
                    ? COLORS.primary
                    : COLORS.gray
              }
            />

            {/* Label */}
            <View style={styles.optionInfo}>
              <Text
                style={[
                  styles.optionLabel,
                  !option.enabled && styles.optionLabelDisabled,
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>

            {/* Coming soon badge */}
            {!option.enabled && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  optionDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.7,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
  },
  optionLabelDisabled: {
    color: COLORS.lightGray,
  },
  optionDescription: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  comingSoonBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.lightGray,
  },
});
