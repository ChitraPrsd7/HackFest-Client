import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/services/auth.service';
import { OneIdService } from '@shared/core/services/one-id.service';
import { AuthResponse } from '@shared/models/user.model';

@Component({
  selector: 'esewa-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  loginError = '';

  /** Must match what is registered on the backend for client 'eSewa-app' */
  private readonly oneIdClientId   = 'eSewa-app';
  private readonly oneIdRedirectUri = 'http://localhost:4202/callback';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private oneIdService: OneIdService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
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
        this.loginError = 'Invalid mobile number or password. Please try again.';
      }
    });
  }

  /**
   * Initiates 1ID Nepal PKCE OAuth2 flow.
   * Generates code_verifier + code_challenge, then redirects the browser
   * to the 1ID authorization endpoint. The IdP will redirect back to
   * http://localhost:4202/callback with ?code=... which CallbackComponent handles.
   */
  loginWith1ID(): void {
    this.oneIdService.initiateLogin(this.oneIdClientId, this.oneIdRedirectUri);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
