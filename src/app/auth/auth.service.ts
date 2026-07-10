import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
  accessCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = false;

  login(payload: LoginPayload): Observable<{ success: boolean; token?: string }> {
    // TODO: Replace with real HTTP call
    console.log('[AuthService] login payload:', payload);
    return of({ success: true, token: 'mock-jwt-token' }).pipe(delay(800));
  }

  register(payload: RegisterPayload): Observable<{ success: boolean; message?: string }> {
    // TODO: Replace with real HTTP call
    console.log('[AuthService] register payload:', payload);
    return of({ success: true, message: 'Account created successfully' }).pipe(delay(800));
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  logout(): void {
    this._isLoggedIn = false;
    localStorage.removeItem('orchid_token');
  }
}
