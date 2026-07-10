// ============================================================
// Shared User & Auth Models
// Used by: eSewa, Daraz, Khalti, Default Client
// ============================================================

export interface LoginPayload {
  identifier: string;   // phone, email, or citizen ID
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword?: string;
  gender?: 'Male' | 'Female' | 'Other';
  promoCode?: string;
  acceptedTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: UserProfile;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  avatarUrl?: string;
  brand?: string;
}

export interface Brand {
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  tagline: string;
}
