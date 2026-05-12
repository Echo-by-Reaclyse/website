export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminQuestion {
  id: string;
  text: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateQuestionData {
  id?: string;
  text: string;
  category_id: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateQuestionData {
  text?: string;
  category_id?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ReorderItem {
  id: string;
  sort_order: number;
}

export interface AuthUserResponse {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUserResponse;
}
