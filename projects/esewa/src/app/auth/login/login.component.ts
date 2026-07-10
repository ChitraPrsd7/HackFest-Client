import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/services/auth.service';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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

  loginWith1ID(): void {
    const oneIdUrl = 'https://auth.1id.gov.np/oauth2/authorize';
    window.location.href = oneIdUrl;
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
