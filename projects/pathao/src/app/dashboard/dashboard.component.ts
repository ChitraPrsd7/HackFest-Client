import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface DriverProfile {
  fullName: string;
  rating: number;
  vehicleNumber: string;
  vehicleType: string;
  isOnline: boolean;
  isVerified1ID: boolean;
}

interface ActiveRequest {
  id: string;
  passengerName: string;
  passengerRating: number;
  pickupLocation: string;
  dropoffLocation: string;
  distance: string;
  fare: number;
}

interface TripLog {
  id: string;
  time: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: 'Completed' | 'Cancelled';
}

@Component({
  selector: 'pathao-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  driver: DriverProfile = {
    fullName: 'Ramesh Bahadur Thapa',
    rating: 4.88,
    vehicleNumber: 'Ba 97 Pa 4589',
    vehicleType: 'Motorcycle (Bike)',
    isOnline: true,
    isVerified1ID: true
  };

  todayEarnings = 2450.00;
  totalTrips = 12;
  onlineHours = 6.8;
  acceptanceRate = 96;

  activeRequest: ActiveRequest | null = {
    id: 'REQ-8761',
    passengerName: 'Anisha Karki',
    passengerRating: 4.9,
    pickupLocation: 'Patan Durbar Square, Lalitpur',
    dropoffLocation: 'Basantapur Durbar Square, Kathmandu',
    distance: '5.2 km',
    fare: 180
  };

  tripLogs: TripLog[] = [
    { id: 'TRP-9811', time: '10:45 AM', pickup: 'Baneshwor, Kathmandu', dropoff: 'Koteshwor, Kathmandu', fare: 120, status: 'Completed' },
    { id: 'TRP-9810', time: '09:20 AM', pickup: 'Thamel, Kathmandu', dropoff: 'Tripureshwor, Kathmandu', fare: 150, status: 'Completed' },
    { id: 'TRP-9809', time: '08:05 AM', pickup: 'Kalimati, Kathmandu', dropoff: 'Pulchowk, Lalitpur', fare: 165, status: 'Completed' },
    { id: 'TRP-9808', time: '07:15 AM', pickup: 'Chabahil, Kathmandu', dropoff: 'Maharajgunj, Kathmandu', fare: 110, status: 'Completed' }
  ];

  recentNotifications = [
    { title: '1ID Nepal verified successfully', time: 'Yesterday', desc: 'Your digital national identity verification check was validated by the system. Earning multiplier activated!' },
    { title: 'Rain surcharge active', time: '2 hours ago', desc: 'High demand in Lalitpur area. Surcharge rate of 1.2x is now live.' },
    { title: 'Weekly payout complete', time: '2 days ago', desc: 'Rs. 14,800.00 has been transferred to your connected bank account.' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleOnlineStatus(): void {
    this.driver.isOnline = !this.driver.isOnline;
    if (!this.driver.isOnline) {
      this.activeRequest = null;
    } else {
      // Simulate ride request when turning online
      setTimeout(() => {
        if (this.driver.isOnline) {
          this.activeRequest = {
            id: 'REQ-8762',
            passengerName: 'Sandesh Shrestha',
            passengerRating: 4.7,
            pickupLocation: 'Tribhuvan International Airport, Ktm',
            dropoffLocation: 'Boudhanath Stupa, Kathmandu',
            distance: '6.4 km',
            fare: 220
          };
        }
      }, 3000);
    }
  }

  acceptRequest(): void {
    if (!this.activeRequest) return;
    
    const acceptedReq = this.activeRequest;
    this.activeRequest = null;
    this.isLoadingRequest = true;

    setTimeout(() => {
      this.isLoadingRequest = false;
      // Add completed trip to history
      const newTrip: TripLog = {
        id: 'TRP-' + (Math.floor(Math.random() * 9000) + 1000),
        time: 'Just Now',
        pickup: acceptedReq.pickupLocation,
        dropoff: acceptedReq.dropoffLocation,
        fare: acceptedReq.fare,
        status: 'Completed'
      };
      
      this.tripLogs.unshift(newTrip);
      this.todayEarnings += acceptedReq.fare;
      this.totalTrips += 1;
    }, 2000);
  }

  isLoadingRequest = false;

  rejectRequest(): void {
    this.activeRequest = null;
    this.acceptanceRate = Math.max(70, this.acceptanceRate - 4);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('brand_auth_token');
    this.router.navigate(['/auth/login']);
  }
}
