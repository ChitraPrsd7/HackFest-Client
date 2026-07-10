import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirm = false;
  successMessage = '';
  errorMessage = '';

  roles = [
    { value: '', label: 'Select role / department' },
    { value: 'admin', label: 'System Administrator' },
    { value: 'moderator', label: 'Content Moderator' },
    { value: 'analyst', label: 'Data Analyst' },
    { value: 'support', label: 'Support Staff' },
    { value: 'developer', label: 'Developer' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      accessCode: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get fullName() { return this.registerForm.get('fullName')!; }
  get email() { return this.registerForm.get('email')!; }
  get role() { return this.registerForm.get('role')!; }
  get accessCode() { return this.registerForm.get('accessCode')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
  get passwordMismatch() {
    return this.registerForm.hasError('passwordMismatch') && this.confirmPassword.touched;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { fullName, email, role, password, confirmPassword, accessCode } = this.registerForm.value;

    this.authService.register({ fullName, email, role, password, confirmPassword, accessCode }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = 'Access request submitted. You will be notified by email.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please check your access code.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
