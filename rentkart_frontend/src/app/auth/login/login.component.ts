import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  phone = '';
  otp = '';
  otpSent = false;

  constructor(private authService: AuthService, private router: Router) {}

  sendOtp() {
  this.authService.sendOtp(this.phone).subscribe({
    next: () => {
      alert('OTP sent to Telegram');
      this.otpSent = true;
    },
    error: () => alert('Failed to send OTP')
  });
}

verifyOtp() {
  this.authService.verifyOtp(this.phone, this.otp).subscribe({
    next: (res: any) => {
      localStorage.setItem('access_token', res.access);
      alert('Login successful');

      // ✅ THIS IS THE MISSING LINE
      this.router.navigate(['/dashboard']);
    },
    error: () => {
      alert('Invalid OTP');
    }
  });
}


}
