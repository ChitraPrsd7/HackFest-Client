import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Transaction {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  icon: string;
}

interface ServiceCard {
  label: string;
  icon: string;
  badge?: string;
  color?: string;
}

@Component({
  selector: 'esewa-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  walletBalance = 517.99;
  userName = 'Aarav Shrestha';
  userInitials = 'AS';
  searchQuery = '';
  selectedCategory = 'all';

  sidebarCategories = [
    { label: 'Topup & Recharge', hasArrow: true },
    { label: 'Electricity & Water', hasArrow: true },
    { label: 'TV Payment', hasArrow: true },
    { label: 'Bus Ticket/Tours and Travels', hasArrow: true },
    { label: 'Education Payment', hasArrow: true },
    { label: 'DOFE/Insurance Payment', hasArrow: true },
    { label: 'Financial Services', hasArrow: true },
    { label: 'Movies & Entertainment', hasArrow: true }
  ];

  quickActions: ServiceCard[] = [
    { label: 'Statement',      icon: '📋' },
    { label: 'Top Up',         icon: '📱' },
    { label: 'Airlines',       icon: '✈️' },
    { label: 'Intl. Airlines', icon: '🌍' },
    { label: 'Govt. Payment',  icon: '🏛️' },
    { label: 'Bus Sewa',       icon: '🚌' },
    { label: 'Internet Bill',  icon: '🌐' },
    { label: 'Cable Car',      icon: '🚡' },
    { label: 'Bank Transfer',  icon: '🏦' },
    { label: 'Send Money',     icon: '💸' },
    { label: 'Load Fund',      icon: '💰' },
    { label: 'My Issues',      icon: '🎫' },
    { label: 'Remittance',     icon: '🌏' }
  ];

  bannerSlides = [
    { title: 'विदेशबाट सिधै eSewa Wallet मा रेमिट्यान्स पठाउनुहोस्!', subtitle: 'Send money from abroad directly', bg: 'linear-gradient(135deg,#1e88e5,#00bcd4)' },
    { title: 'Mobile Recharge under 5 seconds', subtitle: 'Top up any network instantly', bg: 'linear-gradient(135deg,#43a047,#66bb6a)' },
    { title: 'Pay Government Services Online', subtitle: 'Quick, secure, paperless', bg: 'linear-gradient(135deg,#f57c00,#ffb74d)' }
  ];

  activeSlide = 0;

  serviceCards = [
    { badge: 'Coupon', name: 'DGO FIFA Coupon',         bg: '#1a1a2e' },
    { badge: 'TV',     name: 'DishHome FIFA Package',   bg: '#dc2626' },
    { badge: 'TV',     name: 'Subisu FIFA Worldcup Pass', bg: '#3b82f6' },
    { badge: 'TV',     name: 'Net TV (IPTV)',            bg: '#6d28d9' },
    { badge: 'TV',     name: 'Classic Tech',             bg: '#064e3b' }
  ];

  featuredServices = [
    { badge: 'Request QR', name: 'Business QR Request',  },
    { badge: 'eSpeaker',   name: 'eSpeaker Request',     },
    { badge: 'Entrance',   name: 'IOE Entrance Exam',    },
    { badge: 'Registration', name: 'NAME CEE Model Exam' },
    { badge: 'IELTS',      name: 'IELTS Registration',   }
  ];

  merchantSpotlight = [
    { discount: '10% Discount', name: "T'S ARMORE",        bg: '#1a1a2e' },
    { discount: '50% Discount', name: 'ArtiGo Studio',      bg: '#065f46' },
    { discount: '10% off using ESEWA10', name: 'TACHIS',   bg: '#ffffff' },
    { discount: '10% Discount', name: 'Koseeli',            bg: '#fef3c7' },
    { discount: '5% Discount',  name: 'Merchant 5',         bg: '#dc2626' }
  ];

  recentTransactions: Transaction[] = [
    { id: 'T001', name: 'Mobile Top Up - NCell', type: 'Topup', amount: -100, date: '2026-07-10', status: 'success', icon: '📱' },
    { id: 'T002', name: 'Electricity Bill - NEA', type: 'Utility', amount: -1250, date: '2026-07-09', status: 'success', icon: '⚡' },
    { id: 'T003', name: 'Money Received', type: 'Transfer', amount: 2500, date: '2026-07-08', status: 'success', icon: '💰' },
    { id: 'T004', name: 'DishHome TV Renewal', type: 'TV', amount: -900, date: '2026-07-07', status: 'success', icon: '📺' },
    { id: 'T005', name: 'Fund Loaded - Bank', type: 'Load', amount: 5000, date: '2026-07-06', status: 'success', icon: '🏦' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    localStorage.removeItem('brand_auth_token');
    this.router.navigate(['/auth/login']);
  }

  setSlide(i: number): void { this.activeSlide = i; }
}
