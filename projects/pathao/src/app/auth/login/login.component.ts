import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/services/auth.service';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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

  loginWith1ID(): void {
    const oneIdUrl = 'https://auth.1id.gov.np/oauth2/authorize';
    window.location.href = oneIdUrl;
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
