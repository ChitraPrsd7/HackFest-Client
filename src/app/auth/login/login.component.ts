import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
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
      phoneOrId: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  get phoneOrId() { return this.loginForm.get('phoneOrId')!; }
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
    const { phoneOrId, password, remember } = this.loginForm.value;

    this.authService.login({ phoneOrId, password, remember }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.loginError = 'Invalid credentials. Please try again.';
      }
    });
  }

  loginWith1ID(): void {
    // Redirect to Nepal's 1ID national digital identity SSO
    // Replace this URL with the actual 1ID OAuth endpoint when available
    const oneIdUrl = 'https://auth.1id.gov.np/oauth2/authorize';
    window.location.href = oneIdUrl;
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
