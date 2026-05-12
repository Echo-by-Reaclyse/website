import { useState, useCallback } from "react";
import type {
  AdminCategory,
  AdminQuestion,
  AuthResponse,
  CreateCategoryData,
  CreateQuestionData,
  ReorderItem,
  UpdateCategoryData,
  UpdateQuestionData,
} from "@/lib/admin-types";

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3001";
const SESSION_KEY_TOKEN = "echo_admin_token";
const SESSION_KEY_ROLE = "echo_admin_role";

// ── In-session auth store ─────────────────────────────────────────────────────
// Primary storage is sessionStorage so the token survives same-tab refreshes
// but is never written to localStorage. A module-level cache avoids repeated
// sessionStorage reads on every method call.

let _cachedToken: string | null = sessionStorage.getItem(SESSION_KEY_TOKEN);
let _cachedRole: string | null = sessionStorage.getItem(SESSION_KEY_ROLE);

function setAuthState(token: string, role: string): void {
  _cachedToken = token;
  _cachedRole = role;
  sessionStorage.setItem(SESSION_KEY_TOKEN, token);
  sessionStorage.setItem(SESSION_KEY_ROLE, role);
}

function clearAuthState(): void {
  _cachedToken = null;
  _cachedRole = null;
  sessionStorage.removeItem(SESSION_KEY_TOKEN);
  sessionStorage.removeItem(SESSION_KEY_ROLE);
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  withAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (withAuth && _cachedToken) {
    headers["Authorization"] = `Bearer ${_cachedToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore JSON parse errors — keep the status message
    }
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ── Admin API object ──────────────────────────────────────────────────────────

export const adminApi = {
  // ── Auth ───────────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>(
      "/auth/sign-in",
      { method: "POST", body: JSON.stringify({ email, password }) },
      false,
    );
    if (data.user.role !== "admin") {
      throw new Error("Access denied. This dashboard is for admin users only.");
    }
    setAuthState(data.accessToken, data.user.role);
    return data;
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>(
      "/auth/sign-in-google",
      { method: "POST", body: JSON.stringify({ idToken }) },
      false,
    );
    if (data.user.role !== "admin") {
      throw new Error("Access denied. This dashboard is for admin users only.");
    }
    setAuthState(data.accessToken, data.user.role);
    return data;
  },

  async loginWithApple(idToken: string, nonce: string, displayName?: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>(
      "/auth/sign-in-apple",
      { method: "POST", body: JSON.stringify({ idToken, nonce, displayName }) },
      false,
    );
    if (data.user.role !== "admin") {
      throw new Error("Access denied. This dashboard is for admin users only.");
    }
    setAuthState(data.accessToken, data.user.role);
    return data;
  },

  logout(): void {
    clearAuthState();
  },

  getAuthHeader(): { Authorization: string } | Record<string, never> {
    if (!_cachedToken) return {};
    return { Authorization: `Bearer ${_cachedToken}` };
  },

  isAuthenticated(): boolean {
    return _cachedToken !== null && _cachedRole === "admin";
  },

  getRole(): string {
    return _cachedRole ?? "";
  },

  // ── Categories ─────────────────────────────────────────────────────────────

  async getCategories(): Promise<AdminCategory[]> {
    const data = await apiFetch<{ categories: AdminCategory[] }>("/admin/categories");
    return data.categories;
  },

  createCategory(data: CreateCategoryData): Promise<AdminCategory> {
    return apiFetch<AdminCategory>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCategory(id: string, data: UpdateCategoryData): Promise<AdminCategory> {
    return apiFetch<AdminCategory>(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteCategory(id: string): Promise<void> {
    return apiFetch<void>(`/admin/categories/${id}`, { method: "DELETE" });
  },

  reorderCategories(orders: ReorderItem[]): Promise<void> {
    return apiFetch<void>("/admin/categories/reorder", {
      method: "POST",
      body: JSON.stringify({ orders }),
    });
  },

  // ── Questions ──────────────────────────────────────────────────────────────

  async getQuestions(): Promise<AdminQuestion[]> {
    const data = await apiFetch<{ questions: AdminQuestion[] }>("/admin/questions");
    return data.questions;
  },

  createQuestion(data: CreateQuestionData): Promise<AdminQuestion> {
    return apiFetch<AdminQuestion>("/admin/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateQuestion(id: string, data: UpdateQuestionData): Promise<AdminQuestion> {
    return apiFetch<AdminQuestion>(`/admin/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteQuestion(id: string): Promise<void> {
    return apiFetch<void>(`/admin/questions/${id}`, { method: "DELETE" });
  },

  reorderQuestions(orders: ReorderItem[]): Promise<void> {
    return apiFetch<void>("/admin/questions/reorder", {
      method: "POST",
      body: JSON.stringify({ orders }),
    });
  },
} as const;

// ── React hook ────────────────────────────────────────────────────────────────
// Forces a re-render after login / logout so the router's beforeLoad guard
// re-evaluates. We keep a simple counter as the reactive state.

export function useAdminAuth() {
  const [, setTick] = useState(0);

  const login = useCallback(async (email: string, password: string) => {
    const result = await adminApi.login(email, password);
    setTick((t) => t + 1);
    return result;
  }, []);

  const logout = useCallback(() => {
    adminApi.logout();
    setTick((t) => t + 1);
  }, []);

  return {
    isAuthenticated: adminApi.isAuthenticated(),
    role: adminApi.getRole(),
    login,
    logout,
  };
}
