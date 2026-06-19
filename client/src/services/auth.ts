import type { User } from "src/types/user";
import { MOCK_USER } from "src/services/mock-data";

interface SendOtpResult {
  message: string;
}

interface VerifyOtpResult {
  isNewUser: boolean;
  user?: User;
  token?: string;
}

interface RegisterResult {
  user: User;
  token: string;
}

// Simulates network delay so UI feels real during development
function simulateDelay(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  sendOtp: async (phone: string): Promise<SendOtpResult> => {
    await simulateDelay(1200);

    // Basic validation — real validation happens on server
    if (phone.length !== 10) {
      throw {
        code: "AUTH_PHONE_INVALID",
        message: "Please enter a valid 10-digit mobile number.",
      };
    }

    // In dev mode — OTP is always 123456
    return { message: "OTP sent successfully" };
  },

  verifyOtp: async (phone: string, otp: string): Promise<VerifyOtpResult> => {
    await simulateDelay(1000);

    if (otp !== "123456") {
      throw {
        code: "OTP_INCORRECT",
        message: "Incorrect OTP. Please check and try again.",
      };
    }

    // Simulate existing user for phone 9999999999
    // All other phones are treated as new users
    if (phone === "9999999999") {
      return {
        isNewUser: false,
        user: MOCK_USER,
        token: "mock-jwt-token-existing-user",
      };
    }

    return { isNewUser: true };
  },

  register: async (
    phone: string,
    name: string,
    email?: string
  ): Promise<RegisterResult> => {
    await simulateDelay(1000);

    const newUser: User = {
      id: "u_" + Date.now(),
      phone,
      name,
      email,
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    return {
      user: newUser,
      token: "mock-jwt-token-new-user",
    };
  },
};
