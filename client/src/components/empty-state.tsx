import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function EmptyState({
  emoji,
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onAction}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
      {secondaryLabel && onSecondary && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onSecondary}>
          <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 10,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 4,
  },
  primaryButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  secondaryButton: {
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
