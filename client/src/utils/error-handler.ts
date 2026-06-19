import type { ApiError } from "../types/api";

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) {
    if (error.message === "Network Error") {
      return "Check your internet connection and try again.";
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

const ERROR_CODE_MESSAGES: Record<string, string> = {
  AUTH_PHONE_INVALID: "Please enter a valid 10-digit mobile number.",
  OTP_RATE_LIMIT: "Too many OTP requests. Please try after 1 hour.",
  OTP_NOT_FOUND: "OTP not found. Please request a new one.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
  OTP_INCORRECT: "Incorrect OTP. Please check and try again.",
  OTP_MAX_ATTEMPTS: "Too many wrong attempts. Please request a new OTP.",
  USER_NOT_FOUND: "No account found. Please register.",
  AUTH_TOKEN_EXPIRED: "Session expired. Please login again.",
  AUTH_FORBIDDEN: "You do not have permission to do this.",
  ORDER_NOT_FOUND: "Order not found.",
  ORDER_CANCEL_DENIED: "This order cannot be cancelled now.",
  ITEM_UNAVAILABLE: "Some items in your cart are no longer available.",
  CART_EMPTY: "Your cart is empty.",
  COUPON_NOT_FOUND: "This coupon does not exist.",
  COUPON_EXPIRED: "This coupon has expired.",
  COUPON_ALREADY_USED: "You have already used this coupon.",
  COUPON_MIN_ORDER: "Your order total is below the minimum for this coupon.",
  INTERNAL_ERROR: "Server error. Please try again in a moment.",
};

export function getMessageForCode(code: string): string {
  return ERROR_CODE_MESSAGES[code] ?? "Something went wrong. Please try again.";
}
