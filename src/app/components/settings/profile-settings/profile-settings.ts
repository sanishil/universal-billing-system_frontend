import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 class="text-3xl font-bold text-black dark:text-white mb-8">Profile Settings</h1>
      <form class="space-y-6">
        <div class="flex items-center space-x-4 mb-8">
          <div class="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-black dark:text-white">JD</div>
          <button type="button" class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">Change Photo</button>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input [(ngModel)]="name" name="name" class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input [(ngModel)]="email" name="email" type="email" class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
          <input type="password" class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white outline-none">
        </div>
        <button type="submit" class="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition">Update Profile</button>
      </form>
    </div>
  `
})
export class ProfileSettingsComponent {
  name = 'John Doe'; email = 'john@example.com';
}