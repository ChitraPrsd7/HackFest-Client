import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoginPayload, RegisterPayload, AuthResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'brand_auth_token';
  private readonly USER_KEY = 'brand_auth_user';

  // ── Login ──────────────────────────────────────────────────
  login(payload: LoginPayload): Observable<AuthResponse> {
    console.log('[SharedAuthService] login:', payload.identifier);
    const mockResponse: AuthResponse = {
      success: true,
      token: `mock-jwt-${Date.now()}`,
      user: {
        id: 'user-001',
        fullName: 'Demo User',
        email: payload.identifier,
        mobileNumber: payload.identifier,
        brand: 'shared'
      }
    };
    return of(mockResponse).pipe(
      delay(800),
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          if (res.user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          }
        }
      })
    );
  }

  // ── Register ───────────────────────────────────────────────
  register(payload: RegisterPayload): Observable<AuthResponse> {
    console.log('[SharedAuthService] register:', payload.email);
    const mockResponse: AuthResponse = {
      success: true,
      message: 'Account created successfully! You can now log in.',
      token: `mock-jwt-${Date.now()}`
    };
    return of(mockResponse).pipe(delay(1000));
  }

  // ── Logout ─────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // ── Guards / Token Helpers ─────────────────────────────────
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
