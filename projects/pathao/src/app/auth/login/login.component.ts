import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/services/auth.service';
import { OneIdService } from '@shared/core/services/one-id.service';
import { AuthResponse } from '@shared/models/user.model';

@Component({
  selector: 'pathao-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  loginError = '';

  /** Must match what is registered on the backend for client 'pathao-app' */
  private readonly oneIdClientId    = 'pathao-app';
  private readonly oneIdRedirectUri = 'http://localhost:4203/callback';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private oneIdService: OneIdService
  ) {}

  ngOnInit(): void {
    // If already authenticated, go straight to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loginForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern(/^9[678]\d{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get mobileNumber() { return this.loginForm.get('mobileNumber')!; }
  get password() { return this.loginForm.get('password')!; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.loginError = '';
    const { mobileNumber, password } = this.loginForm.value;

    this.authService.login({ identifier: mobileNumber, password, remember: false }).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.loginError = 'Invalid credentials. Please make sure you are registered as a Pathao Driver.';
      }
    });
  }

  /**
   * Initiates 1ID Nepal PKCE OAuth2 flow.
   * Generates code_verifier + code_challenge, then redirects the browser
   * to the 1ID authorization endpoint. The IdP will redirect back to
   * http://localhost:4201/callback with ?code=... which CallbackComponent handles.
   */
  loginWith1ID(): void {
    this.oneIdService.initiateLogin(this.oneIdClientId, this.oneIdRedirectUri);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
