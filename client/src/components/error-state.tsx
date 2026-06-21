import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  emoji?: string;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  emoji = "⚠️",
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
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
    gap: 12,
  },
  emoji: {
    fontSize: 48,
  },
  message: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
});
