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
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "@services/auth";
import { showToast } from "@utils/toast";
import { getMessageForCode, isApiError } from "@utils/error-handler";
import { COLORS } from "src/constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = phone.length === 10;

  const handlePhoneChange = (text: string) => {
    // only allow digits
    const digits = text.replace(/[^0-9]/g, "");
    setPhone(digits);
  };

  const handleSendOtp = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      await authService.sendOtp(phone);
      router.push({
        pathname: "/(auth)/otp",
        params: { phone },
      });
    } catch (error) {
      const message = isApiError(error)
        ? getMessageForCode(error.code)
        : "Something went wrong. Please try again.";
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Green header */}
        <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
          <Text style={styles.headerEmoji}>🌿</Text>
          <Text style={styles.headerTitle}>Meera Hotel</Text>
          <Text style={styles.headerSubtitle}>
            Pure Vegetarian • Pure Taste
          </Text>
        </View>

        {/* White card */}
        <View style={[styles.card, { paddingBottom: insets.bottom + 40 }]}>
          <Text style={styles.cardTitle}>Enter Mobile Number</Text>
          <Text style={styles.cardSubtitle}>
            We will send you a 6-digit OTP to verify
          </Text>

          {/* Phone input row */}
          <View style={styles.inputRow}>
            {/* +91 prefix */}
            <View
              style={[styles.prefixBox, isFocused && styles.prefixBoxFocused]}
            >
              <Text style={styles.prefixText}>+91</Text>
            </View>

            {/* Phone number input */}
            <TextInput
              ref={inputRef}
              style={[styles.phoneInput, isFocused && styles.phoneInputFocused]}
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="Enter 10-digit number"
              placeholderTextColor={COLORS.lightGray}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="done"
              onSubmitEditing={handleSendOtp}
              editable={!isLoading}
            />
          </View>

          {/* Character count */}
          <Text style={styles.charCount}>{phone.length}/10</Text>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* Send OTP button */}
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={!isValid || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Dev hint */}
          <View style={styles.devHint}>
            <Text style={styles.devHintText}>
              Dev mode: Use any 10-digit number. OTP is{" "}
              <Text style={styles.devHintCode}>123456</Text>
            </Text>
          </View>
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
  },
  headerEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
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

    // paddingBottom: 40,
    // minHeight: "100%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.lightGray,
    marginBottom: 24,
  },

  // input
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  prefixBox: {
    width: 62,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  prefixBoxFocused: {
    borderColor: COLORS.primary,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.dark,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.dark,
    letterSpacing: 1,
  },
  phoneInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  charCount: {
    fontSize: 11,
    color: COLORS.lightGray,
    textAlign: "right",
    marginBottom: 16,
  },

  // terms
  terms: {
    fontSize: 11,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
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
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // dev hint
  devHint: {
    marginTop: 24,
    padding: 12,
    backgroundColor: COLORS.orangeLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFCC80",
  },
  devHintText: {
    fontSize: 12,
    color: COLORS.orange,
    textAlign: "center",
  },
  devHintCode: {
    fontWeight: "700",
  },
});
