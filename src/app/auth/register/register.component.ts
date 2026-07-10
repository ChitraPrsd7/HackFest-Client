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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      citizenshipNumber: ['', [Validators.required, Validators.minLength(5)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(98|97|96)\d{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get fullName() { return this.registerForm.get('fullName')!; }
  get citizenshipNumber() { return this.registerForm.get('citizenshipNumber')!; }
  get phoneNumber() { return this.registerForm.get('phoneNumber')!; }
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
    this.successMessage = '';
    const { fullName, citizenshipNumber, phoneNumber, password, confirmPassword } = this.registerForm.value;

    this.authService.register({ fullName, citizenshipNumber, phoneNumber, password, confirmPassword }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = 'Registration successful! You can now log in.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please check your inputs.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
