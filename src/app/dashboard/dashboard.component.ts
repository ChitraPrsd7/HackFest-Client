import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AppliedService {
  id: string;
  serviceName: string;
  appliedDate: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Action Required';
  estimatedDays: number | string;
}

interface OfficialNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  sender: string;
}

interface CitizenDocument {
  name: string;
  type: string;
  size: string;
  issuedDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  selectedProject = 'Citizen Portal - Nagarik App';
  currentTab = 'overview';

  citizenProfile = {
    fullName: 'Ram Bahadur Thapa',
    citizenshipNumber: '27-01-72-04532',
    phoneNumber: '9851045230',
    email: 'ram.thapa@gmail.com',
    wardNumber: 4,
    municipality: 'Kathmandu Metropolitan City'
  };

  appliedServices: AppliedService[] = [
    { id: 'APP-9012', serviceName: 'e-Passport Application', appliedDate: '2026-07-08', status: 'Pending', estimatedDays: 12 },
    { id: 'APP-8843', serviceName: 'Citizenship Certificate Verification', appliedDate: '2026-07-02', status: 'Approved', estimatedDays: 'Completed' },
    { id: 'APP-7634', serviceName: 'Smart Driving License Renewal', appliedDate: '2026-06-20', status: 'Action Required', estimatedDays: 'Visit Ward Office' },
    { id: 'APP-5421', serviceName: 'National Identity Card (NID) Update', appliedDate: '2026-06-05', status: 'Approved', estimatedDays: 'Completed' }
  ];

  notifications: OfficialNotification[] = [
    { id: '1', title: 'Ward 4 General Assembly Notice', message: 'The annual community gathering is scheduled for July 15, 2026 at the ward community center. All citizens are requested to participate.', date: '2026-07-10', sender: 'Ward Office 4' },
    { id: '2', title: 'Driving License Bio-metrics Verification', message: 'Action required: Please visit the Yatayat Ekai office with original documents for biometric capture regarding APP-7634.', date: '2026-07-09', sender: 'Ministry of Infrastructure' },
    { id: '3', title: 'Tax Clearance System online', message: 'You can now download and pay your property taxes directly from the local government billing system.', date: '2026-07-01', sender: 'Kathmandu Metropolitan City' }
  ];

  documents: CitizenDocument[] = [
    { name: 'Citizenship_Certificate_27-01.pdf', type: 'PDF Document', size: '1.2 MB', issuedDate: '2026-07-02' },
    { name: 'National_ID_Card_Copy.pdf', type: 'PDF Document', size: '890 KB', issuedDate: '2026-06-05' },
    { name: 'Property_Tax_Receipt_2082.pdf', type: 'PDF Document', size: '420 KB', issuedDate: '2026-07-01' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
