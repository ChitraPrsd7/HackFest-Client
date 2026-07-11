import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OneIdService } from '@shared/core/services/one-id.service';

@Component({
  selector: 'pathao-callback',
  standalone: false,
  template: `
    <div class="callback-wrapper">
      <div class="callback-card">
        <div class="spinner"></div>
        <p class="callback-text">Verifying your 1ID credentials…</p>
        <p class="callback-sub" *ngIf="error">{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a0a00 0%, #2d1300 50%, #4a1e00 100%);
    }
    .callback-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 48px 56px;
      text-align: center;
      backdrop-filter: blur(12px);
    }
    .spinner {
      width: 48px; height: 48px;
      border: 4px solid rgba(255,255,255,0.15);
      border-top-color: #ff6b2b;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      margin: 0 auto 24px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .callback-text {
      color: #e0e0e0;
      font-size: 1rem;
      margin: 0 0 8px;
      font-family: 'Inter', sans-serif;
    }
    .callback-sub {
      color: #ff6b6b;
      font-size: 0.85rem;
      margin: 0;
    }
  `]
})
export class CallbackComponent implements OnInit {

  /** Must match backend registered client */
  private readonly clientId    = 'pathao-app';
  private readonly redirectUri = 'http://localhost:4203/callback';

  error = '';

  constructor(
    private route:      ActivatedRoute,
    private router:     Router,
    private oneIdService: OneIdService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code  = params['code']  as string | undefined;
      const state = params['state'] as string | undefined;

      if (!code) {
        const idpError = params['error_description'] || params['error'] || 'Unknown error';
        console.error('[Pathao Callback] No auth code received:', idpError);
        this.error = `Login failed: ${idpError}`;
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        return;
      }

      console.log('[Pathao Callback] Received code, exchanging for tokens…');

      this.oneIdService.handleCallback(code, this.clientId, this.redirectUri).subscribe({
        next: (tokens) => {
          console.log('[Pathao Callback] Token exchange successful:', tokens.token_type);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('[Pathao Callback] Token exchange failed:', err);
          this.error = 'Failed to complete login. Redirecting…';
          setTimeout(() => this.router.navigate(['/auth/login']), 3000);
        }
      });
    });
  }
}
