import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface CitizenRequest {
  id: string;
  name: string;
  service: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  ward: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  selectedProject = 'Nagarik Portal - Central';
  currentTab = 'overview';
  
  stats = {
    totalCitizens: 124500,
    verifiedPercentage: 94.2,
    pendingVerifications: 1420,
    servicesActive: 48
  };

  recentRequests: CitizenRequest[] = [
    { id: 'REQ-1049', name: 'Ram Bahadur Thapa', service: 'Citizenship Verification', date: '2026-07-10', status: 'Pending', ward: 4 },
    { id: 'REQ-1048', name: 'Sita Kumari Devi', service: 'Relationship Certificate', date: '2026-07-09', status: 'Approved', ward: 7 },
    { id: 'REQ-1047', name: 'Hari Prasad Sharma', service: 'National ID Update', date: '2026-07-09', status: 'Approved', ward: 2 },
    { id: 'REQ-1046', name: 'Gita Shrestha', service: 'Vital Registration', date: '2026-07-08', status: 'Rejected', ward: 12 },
    { id: 'REQ-1045', name: 'Niranjan Rijal', service: 'Address Proof Verification', date: '2026-07-08', status: 'Pending', ward: 9 }
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
