import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordGeneratorComponent } from '../../components/password-generator/password-generator.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PasswordGeneratorComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1 class="title">Password Manager</h1>
        <div class="user-profile">
          <span class="username">{{ username }}</span>
          <button (click)="deleteAccount()" class="delete-account-button">Delete Account</button>
          <button (click)="logout()" class="logout-button">Logout</button>
        </div>
      </header>
      <main class="dashboard-content">
        <div class="password-list">
          <h2>Your Accounts</h2>
          <div class="password-actions">
            <button class="add-account-button">Add New Account</button>
          </div>
          <div class="password-items">
            <!-- Account items will be displayed here -->
            <p class="no-accounts" *ngIf="!hasAccounts">No accounts saved yet. Add your first account!</p>
          </div>
        </div>
      </main>
      <app-password-generator></app-password-generator>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .dashboard-header {
      background-color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
      text-align: center;
      flex: 1;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .username {
      color: #666;
      font-weight: 500;
    }

    .delete-account-button {
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .delete-account-button:hover {
      background-color: #c82333;
    }

    .logout-button {
      padding: 0.5rem 1rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .logout-button:hover {
      background-color: #5a6268;
    }

    .dashboard-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .password-list {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .password-actions {
      margin-bottom: 1.5rem;
    }

    .add-account-button {
      padding: 0.75rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .add-account-button:hover {
      background-color: #0056b3;
    }

    .password-items {
      min-height: 200px;
    }

    .no-accounts {
      text-align: center;
      color: #666;
      margin-top: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  hasAccounts: boolean = false;
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Get username from auth service
    this.username = this.authService.getUsername() || '';
  }

  logout() {
    this.authService.logout();
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        }
      });
    }
  }
} 