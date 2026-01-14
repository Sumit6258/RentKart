import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) {}

  sendOtp(phone: string) {
    return this.http.post(`${this.baseUrl}/send-otp/`, { phone });
  }

  verifyOtp(phone: string, otp: string) {
    return this.http.post(`${this.baseUrl}/verify-otp/`, { phone, otp });
  }
}
