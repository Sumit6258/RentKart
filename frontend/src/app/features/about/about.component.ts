import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-white py-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <h1 class="text-4xl font-bold text-center mb-8">About Rentkart</h1>
        <div class="prose prose-lg mx-auto">
          <p class="text-gray-700 leading-relaxed mb-6">
            Rentkart is India's leading rental marketplace, connecting people who want to rent with those who have items to share.
          </p>
          <h2 class="text-2xl font-bold mb-4">How It Works</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="text-4xl mb-3">🔍</div>
              <h3 class="font-bold mb-2">Browse</h3>
              <p class="text-gray-600 text-sm">Find the perfect item from thousands of listings</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-3">🤝</div>
              <h3 class="font-bold mb-2">Connect</h3>
              <p class="text-gray-600 text-sm">Contact verified vendors directly</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-3">✨</div>
              <h3 class="font-bold mb-2">Enjoy</h3>
              <p class="text-gray-600 text-sm">Use the item and return when done</p>
            </div>
          </div>
          <div class="text-center mt-12">
            <a routerLink="/products" class="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
              Start Browsing
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
