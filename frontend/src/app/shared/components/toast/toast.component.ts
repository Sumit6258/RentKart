import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toasts$ | async"
           [class]="getToastClass(toast.type)"
           class="px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out max-w-md animate-slide-in">
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ getIcon(toast.type) }}</span>
          <p class="font-medium">{{ toast.message }}</p>
          <button (click)="toastService.remove(toast.id)" 
                  class="ml-auto text-xl opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  toasts$!: Observable<Toast[]>;

  constructor(public toastService: ToastService) {
    this.toasts$ = this.toastService.toasts;
  }

  getToastClass(type: Toast['type']): string {
    const base = 'border-l-4 ';
    switch (type) {
      case 'success':
        return base + 'bg-green-50 border-green-500 text-green-900';
      case 'error':
        return base + 'bg-red-50 border-red-500 text-red-900';
      case 'warning':
        return base + 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'info':
        return base + 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return base + 'bg-gray-50 border-gray-500 text-gray-900';
    }
  }

  getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }
}
