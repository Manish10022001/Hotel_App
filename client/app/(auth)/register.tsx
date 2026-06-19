import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";

import { authService } from "@services/auth";
import { useAuth } from "@context/auth-context";
import { showToast } from "@utils/toast";
import { getMessageForCode, isApiError } from "@utils/error-handler";

interface RegisterFormData {
  name: string;
  email: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await authService.register(
        phone,
        data.name.trim(),
        data.email.trim() || undefined
      );
      await login(result.user, result.token);
      // auth gate in _layout.tsx handles redirect to tabs
    } catch (error) {
      const message = isApiError(error)
        ? getMessageForCode(error.code)
        : "Registration failed. Please try again.";
      showToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: COLORS.white },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Green header */}
        <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerEmoji}>👤</Text>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>
            Tell us a little about yourself
          </Text>
        </View>

        {/* White card */}
        <View style={[styles.card, { paddingBottom: insets.bottom + 40 }]}>
          {/* Phone display — not editable */}
          <View style={styles.phoneDisplay}>
            <Text style={styles.phoneDisplayLabel}>Mobile Number</Text>
            <View style={styles.phoneDisplayRow}>
              <Text style={styles.phoneDisplayValue}>+91 {phone}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must be under 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z ]+$/,
                  message: "Name can only contain letters and spaces",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.lightGray}
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>⚠ {errors.name.message}</Text>
            )}
          </View>

          {/* Email — optional */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Email Address <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <Controller
              control={control}
              name="email"
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter your email (optional)"
                  placeholderTextColor={COLORS.lightGray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  editable={!isLoading}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>⚠ {errors.email.message}</Text>
            )}
            <Text style={styles.fieldHint}>
              For order confirmations and receipts
            </Text>
          </View>

          {/* Create Account button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Account →</Text>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            By creating an account you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // header
  header: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingBottom: 32,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 0,
    padding: 8,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: "600",
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 4,
  },

  // card
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
  },

  // phone display
  phoneDisplay: {
    marginBottom: 16,
  },
  phoneDisplayLabel: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 6,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  phoneDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phoneDisplayValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
  },
  verifiedBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 24,
  },

  // form fields
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
  },
  required: {
    color: COLORS.red,
  },
  optional: {
    color: COLORS.lightGray,
    fontWeight: "400",
  },
  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.dark,
  },
  inputError: {
    borderColor: COLORS.red,
    backgroundColor: COLORS.redLight,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 6,
  },
  fieldHint: {
    fontSize: 11,
    color: COLORS.lightGray,
    marginTop: 5,
  },

  // button
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // terms
  terms: {
    fontSize: 11,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
