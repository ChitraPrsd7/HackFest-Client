import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/core/services/auth.service';
import { AuthResponse } from '@shared/models/user.model';

@Component({
  selector: 'pathao-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  registerError = '';
  registerSuccess = '';
  selectedGender: 'Male' | 'Female' | 'Other' | '' = '';
  selectedVehicle: 'Bike' | 'Car' | 'Cycle' | '' = '';
  showPromoInput = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName:     ['', [Validators.required, Validators.minLength(2)]],
      email:        ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^9[678]\d{8}$/)]],
      licenseNumber: ['', [Validators.required, Validators.minLength(6)]],
      bluebookNumber: ['', [Validators.required, Validators.minLength(6)]],
      promoCode:    [''],
      acceptedTerms: [false, Validators.requiredTrue]
    });
  }

  get fullName()       { return this.registerForm.get('fullName')!; }
  get email()          { return this.registerForm.get('email')!; }
  get mobileNumber()   { return this.registerForm.get('mobileNumber')!; }
  get licenseNumber()  { return this.registerForm.get('licenseNumber')!; }
  get bluebookNumber() { return this.registerForm.get('bluebookNumber')!; }

  selectGender(g: 'Male' | 'Female' | 'Other'): void {
    this.selectedGender = g;
  }

  selectVehicle(v: 'Bike' | 'Car' | 'Cycle'): void {
    this.selectedVehicle = v;
  }

  togglePromo(): void {
    this.showPromoInput = !this.showPromoInput;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (!this.selectedVehicle) {
      this.registerError = 'Please select your vehicle type.';
      return;
    }
    if (!this.selectedGender) {
      this.registerError = 'Please select your gender.';
      return;
    }
    this.isLoading = true;
    this.registerError = '';

    // Mock registration using shared auth service
    this.authService.register({
      fullName:      this.fullName.value,
      email:         this.email.value,
      mobileNumber:  this.mobileNumber.value,
      password:      '',
      gender:        this.selectedGender as 'Male' | 'Female' | 'Other',
      promoCode:     this.registerForm.get('promoCode')?.value,
      acceptedTerms: true
    }).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        if (res.success) {
          this.registerSuccess = 'Driver application submitted successfully! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        }
      },
      error: () => {
        this.isLoading = false;
        this.registerError = 'Driver registration failed. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
