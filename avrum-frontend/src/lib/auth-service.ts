import { apiClient, tokenStorage } from "./api-client";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  organisation?: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  role: string;
  userType?: string;
  language?: string;
  theme?: "light" | "dark";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  fullName: string;
  organisation?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface OnboardingDraftPayload {
  step?: number;
  data?: Record<string, unknown>;
}

export interface OnboardingCompletePayload {
  draft?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

// Auth service
export const authService = {
  async register(payload: RegisterPayload) {
    const response = await apiClient.post<{
      user: User;
      requiresVerification: boolean;
    }>("/auth/register", {
      fullName: payload.fullName,
      organisation: payload.organisation,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    });
    return response.data;
  },

  async verifyEmail(payload: VerifyEmailPayload) {
    const response = await apiClient.post<AuthResponse>("/auth/verify-email", {
      email: payload.email,
      code: payload.code,
    });

    if (response.data.accessToken && response.data.refreshToken) {
      tokenStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response.data;
  },

  async login(payload: LoginPayload) {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email: payload.email,
      password: payload.password,
      remember: payload.remember,
    });

    if (response.data.accessToken && response.data.refreshToken) {
      tokenStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response.data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenStorage.clearTokens();
    }
  },

  async forgotPassword(email: string) {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resendVerificationEmail(email: string) {
    await apiClient.post("/auth/resend-verification-email", { email });
  },

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ) {
    await apiClient.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;

    const userStr = window.localStorage.getItem("currentUser");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("currentUser");
    }
  },

  isAuthenticated(): boolean {
    return typeof window !== "undefined" && Boolean(tokenStorage.getAccessToken());
  },

  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  },
};

// Onboarding service
export const onboardingService = {
  async saveDraft(payload: OnboardingDraftPayload) {
    const response = await apiClient.post<{
      draftId: string;
      savedAt: string;
    }>("/v1/onboarding/draft", {
      step: payload.step,
      data: payload.data,
    });
    return response.data;
  },

  async complete(payload: OnboardingCompletePayload) {
    const response = await apiClient.post<{ user: User }>(
      "/v1/onboarding/complete",
      {
        draft: payload.draft,
        data: payload.data,
      }
    );
    authService.setCurrentUser(response.data.user);
    return response.data;
  },
};
