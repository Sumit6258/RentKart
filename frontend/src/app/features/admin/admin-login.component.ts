import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🔐</div>
          <h2 class="text-4xl font-bold text-white mb-2">Admin Access</h2>
          <p class="text-gray-400">Authorized Personnel Only</p>
        </div>

        <div class="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-5">
              <label class="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <input formControlName="email" type="email" 
                     class="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                     placeholder="admin@rentkart.com"
                     [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 class="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Valid email is required
              </p>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input formControlName="password" type="password" 
                     class="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                     placeholder="••••••••"
                     [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Password is required
              </p>
            </div>

            <button type="submit" 
                    [disabled]="loginForm.invalid || loading"
                    class="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <span *ngIf="!loading">🔓 Access Admin Panel</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            </button>

            <div class="mt-6 text-center">
              <a routerLink="/" class="text-gray-400 hover:text-white text-sm">
                ← Return to Main Site
              </a>
            </div>
          </form>
        </div>

        <div class="mt-6 text-center">
          <p class="text-gray-500 text-xs">
            ⚠️ Unauthorized access attempts are logged and monitored
          </p>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      
      this.http.post(`${environment.apiUrl}/auth/admin/login/`, this.loginForm.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('accessToken', response.tokens.access);
          localStorage.setItem('refreshToken', response.tokens.refresh);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          this.toastService.success('🔓 Admin access granted');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          this.toastService.error('❌ Invalid admin credentials');
          this.loading = false;
        }
      });
    }
  }
}
