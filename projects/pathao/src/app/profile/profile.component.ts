import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface DriverDocument {
  name: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  expiryDate?: string;
}

@Component({
  selector: 'pathao-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  isEditMode = false;
  saveSuccess = false;
  avatarInitials = 'RB';

  driver = {
    fullName: 'Ramesh Bahadur Thapa',
    email: 'ramesh.thapa@gmail.com',
    mobileNumber: '9841234567',
    gender: 'Male',
    dob: '1990-05-15',
    address: 'Baneshwor, Kathmandu, Nepal',
    joinedDate: 'March 2022',
    rating: 4.88,
    totalTrips: 2847,
    totalEarnings: 485200,
    acceptanceRate: 96,
    completionRate: 98,
    vehicleType: 'Motorcycle',
    vehicleModel: 'Honda CB Shine 125cc',
    vehicleNumber: 'Ba 97 Pa 4589',
    vehicleColor: 'Red',
    licenseNumber: 'NL-03-2019-012345',
    bluebookNumber: 'BB-KTM-2020-889900',
    isVerified1ID: true,
    nidNumber: '12345678901234',
    isOnline: true,
    emergencyContact: '9800000001',
    bankName: 'Nepal Investment Bank',
    bankAccount: '***** 4321',
    esewaLinked: true,
    khaltiLinked: false
  };

  documents: DriverDocument[] = [
    { name: 'National ID (1ID)', status: 'Verified', expiryDate: 'Lifetime' },
    { name: 'Driving License', status: 'Verified', expiryDate: '2027-06-30' },
    { name: 'Vehicle Bluebook', status: 'Verified', expiryDate: '2025-12-31' },
    { name: 'Insurance Certificate', status: 'Pending' },
    { name: 'Police Clearance', status: 'Verified', expiryDate: '2026-01-15' }
  ];

  badges = [
    { icon: '⭐', label: 'Top Rated', desc: 'Rating above 4.8' },
    { icon: '🏆', label: '2000+ Trips', desc: 'Power Driver' },
    { icon: '🛡️', label: '1ID Verified', desc: 'Identity Confirmed' },
    { icon: '⚡', label: 'Fast Acceptor', desc: '96% Acceptance' }
  ];

  editForm!: FormGroup;
  activeTab: 'overview' | 'vehicle' | 'documents' | 'earnings' = 'overview';

  monthlyStats = [
    { month: 'Feb', trips: 198, earnings: 31200 },
    { month: 'Mar', trips: 224, earnings: 35800 },
    { month: 'Apr', trips: 210, earnings: 33600 },
    { month: 'May', trips: 245, earnings: 39200 },
    { month: 'Jun', trips: 268, earnings: 42800 },
    { month: 'Jul', trips: 142, earnings: 22700 }
  ];

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildEditForm();
    this.avatarInitials = this.driver.fullName
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('');
  }

  buildEditForm(): void {
    this.editForm = this.fb.group({
      fullName: [this.driver.fullName, Validators.required],
      email: [this.driver.email, [Validators.required, Validators.email]],
      mobileNumber: [this.driver.mobileNumber, Validators.required],
      address: [this.driver.address],
      emergencyContact: [this.driver.emergencyContact]
    });
  }

  setTab(tab: 'overview' | 'vehicle' | 'documents' | 'earnings'): void {
    this.activeTab = tab;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.saveSuccess = false;
    if (this.isEditMode) {
      this.buildEditForm();
    }
  }

  saveProfile(): void {
    if (this.editForm.invalid) return;
    const val = this.editForm.value;
    this.driver.fullName = val.fullName;
    this.driver.email = val.email;
    this.driver.mobileNumber = val.mobileNumber;
    this.driver.address = val.address;
    this.driver.emergencyContact = val.emergencyContact;
    this.avatarInitials = this.driver.fullName
      .split(' ')
      .slice(0, 2)
      .map((n: string) => n[0])
      .join('');
    this.isEditMode = false;
    this.saveSuccess = true;
    setTimeout(() => this.saveSuccess = false, 3000);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('brand_auth_token');
    this.router.navigate(['/auth/login']);
  }

  getMaxEarnings(): number {
    return Math.max(...this.monthlyStats.map(m => m.earnings));
  }

  getBarHeight(earnings: number): number {
    return Math.round((earnings / this.getMaxEarnings()) * 100);
  }
}
