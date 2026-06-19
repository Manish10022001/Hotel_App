import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OTP_LENGTH, OTP_TIMER_SECONDS } from "@constants/app";
import { authService } from "@services/auth";
import { useAuth } from "@context/auth-context";
import { showToast } from "@utils/toast";
import { getMessageForCode, isApiError } from "@utils/error-handler";

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  // countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // auto focus first box on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (text: string, index: number) => {
    // handle paste — user pastes full 6-digit OTP
    if (text.length === OTP_LENGTH) {
      const digits = text
        .replace(/[^0-9]/g, "")
        .split("")
        .slice(0, OTP_LENGTH);
      if (digits.length === OTP_LENGTH) {
        setOtp(digits);
        inputRefs.current[OTP_LENGTH - 1]?.focus();
        setFocusedIndex(OTP_LENGTH - 1);
        return;
      }
    }

    // normal single digit input
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // advance to next box
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index]) {
        // clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // move to previous box and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(OTP_TIMER_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);

    try {
      await authService.sendOtp(phone);
      showToast.success("OTP sent again to +91 " + phone);
    } catch (error) {
      const message = isApiError(error)
        ? getMessageForCode(error.code)
        : "Failed to resend OTP. Try again.";
      showToast.error(message);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < OTP_LENGTH || isLoading) return;

    setIsLoading(true);
    try {
      const result = await authService.verifyOtp(phone, otpString);

      if (result.isNewUser) {
        router.push({
          pathname: "/(auth)/register",
          params: { phone },
        });
      } else if (result.user && result.token) {
        await login(result.user, result.token);
        // auth gate in _layout.tsx handles redirect to tabs
      }
    } catch (error) {
      const message = isApiError(error)
        ? getMessageForCode(error.code)
        : "Verification failed. Please try again.";
      showToast.error(message);

      // clear OTP on wrong attempt
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");
  const maskedPhone = phone
    ? phone.slice(0, 2) + "XXXXXX" + phone.slice(-2)
    : "";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Green header */}
      <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerEmoji}>🔐</Text>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <Text style={styles.headerSubtitle}>
          Code sent to +91 {maskedPhone}
        </Text>
      </View>

      {/* White card */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.cardTitle}>Enter 6-digit OTP</Text>
        <Text style={styles.cardSubtitle}>
          Check your SMS messages for the code
        </Text>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {Array(OTP_LENGTH)
            .fill(null)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  focusedIndex === index && styles.otpBoxFocused,
                  otp[index] !== "" && styles.otpBoxFilled,
                ]}
                value={otp[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                textAlign="center"
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
        </View>

        {/* Timer / Resend */}
        <View style={styles.timerRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendActive}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend OTP in{" "}
              <Text style={styles.timerCount}>{formatTimer(timer)}</Text>
            </Text>
          )}
        </View>

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.button, !isComplete && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={!isComplete || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        {/* Wrong number */}
        <TouchableOpacity
          style={styles.wrongNumberRow}
          onPress={() => router.back()}
        >
          <Text style={styles.wrongNumberText}>
            Wrong number? <Text style={styles.wrongNumberLink}>Change</Text>
          </Text>
        </TouchableOpacity>

        {/* Dev hint */}
        <View style={styles.devHint}>
          <Text style={styles.devHintText}>
            Dev mode: OTP is <Text style={styles.devHintCode}>123456</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.lightGray,
    marginBottom: 28,
  },

  // OTP boxes
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.dark,
    textAlign: "center",
  },
  otpBoxFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },

  // timer
  timerRow: {
    alignItems: "center",
    marginBottom: 24,
  },
  timerText: {
    fontSize: 13,
    color: COLORS.lightGray,
  },
  timerCount: {
    color: COLORS.dark,
    fontWeight: "600",
  },
  resendActive: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
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

  // wrong number
  wrongNumberRow: {
    alignItems: "center",
    marginBottom: 20,
  },
  wrongNumberText: {
    fontSize: 13,
    color: COLORS.lightGray,
  },
  wrongNumberLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // dev hint
  devHint: {
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
