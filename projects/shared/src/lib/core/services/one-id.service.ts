import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface OneIdTokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class OneIdService {

  /** Auth server URL (matches backend team setup) */
  private readonly authServer = 'http://localhost:8080';

  /** Storage keys */
  private readonly ACCESS_TOKEN  = '1id_access_token';
  private readonly ID_TOKEN      = '1id_id_token';
  private readonly REFRESH_TOKEN = '1id_refresh_token';
  private readonly CODE_VERIFIER = '1id_code_verifier';

  constructor(private http: HttpClient, private router: Router) {}

  // ─────────────────────────────────────────────────────────────
  // Step 1 — Redirect to 1ID IdP
  //
  // Pass the clientId and redirectUri registered on the backend:
  //   eSewa  → clientId='eSewa-app',  redirectUri='http://localhost:4202/callback'
  //   Pathao → clientId='pathao-app', redirectUri='http://localhost:4203/callback'
  // ─────────────────────────────────────────────────────────────
  initiateLogin(clientId: string, redirectUri: string): void {
    const codeVerifier = this.generateCodeVerifier();
    sessionStorage.setItem(this.CODE_VERIFIER, codeVerifier);

    this.generateCodeChallenge(codeVerifier).then(codeChallenge => {
      const state = crypto.randomUUID();

      const params = new HttpParams()
        .set('client_id',             clientId)
        .set('redirect_uri',          redirectUri)
        .set('scope',                 'openid profile citizenship_data')
        .set('response_type',         'code')
        .set('state',                 state)
        .set('code_challenge',        codeChallenge)
        .set('code_challenge_method', 'S256');

      window.location.href =
        `${this.authServer}/oauth2/authorization/nagarik?${params.toString()}`;
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Step 2 — Exchange auth code for tokens
  // ─────────────────────────────────────────────────────────────
  handleCallback(code: string, clientId: string, redirectUri: string): Observable<OneIdTokenResponse> {
    const codeVerifier = sessionStorage.getItem(this.CODE_VERIFIER) ?? '';

    const body = new HttpParams()
      .set('client_id',     clientId)
      .set('grant_type',    'authorization_code')
      .set('code',          code)
      .set('redirect_uri',  redirectUri)
      .set('code_verifier', codeVerifier);

    return this.http
      .post<OneIdTokenResponse>(
        `${this.authServer}/oauth2/token`,
        body.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      .pipe(
        tap((tokens: OneIdTokenResponse) => {
          localStorage.setItem(this.ACCESS_TOKEN, tokens.access_token);
          if (tokens.id_token)      localStorage.setItem(this.ID_TOKEN,      tokens.id_token);
          if (tokens.refresh_token) localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
          sessionStorage.removeItem(this.CODE_VERIFIER);
        })
      );
  }

  // ─────────────────────────────────────────────────────────────
  // Step 3 — Fetch citizen profile using access token
  // ─────────────────────────────────────────────────────────────
  getCitizenData(): Observable<any> {
    const token = localStorage.getItem(this.ACCESS_TOKEN);
    return this.http.get(`${this.authServer}/api/res/person/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────────────────────
  logout(): Observable<any> {
    return this.http
      .post(`${this.authServer}/api/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => {
        this.clearTokens();
        this.router.navigate(['/auth/login']);
      }));
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.ID_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    sessionStorage.removeItem(this.CODE_VERIFIER);
  }

  isLoggedInWith1ID(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  // ─────────────────────────────────────────────────────────────
  // PKCE helpers
  // ─────────────────────────────────────────────────────────────
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data    = encoder.encode(verifier);
    const digest  = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g,  '');
  }

  getUserData(): Observable<any> {
  const token = this.getAccessToken();

  return this.http.get(`${this.authServer}/api/res/person/data`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

}
