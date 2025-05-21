import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Password Manager</h1>
        <button (click)="logout()" class="logout-button">Logout</button>
      </header>
      <main class="dashboard-content">
        <div class="password-list">
          <h2>Your Passwords</h2>
          <div class="password-actions">
            <button class="add-password-button">Add New Password</button>
          </div>
          <div class="password-items">
            <!-- Password items will be displayed here -->
            <p class="no-passwords" *ngIf="!hasPasswords">No passwords saved yet. Add your first password!</p>
          </div>
        </div>
      </main>
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

    h1 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .logout-button {
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .logout-button:hover {
      background-color: #c82333;
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

    .add-password-button {
      padding: 0.75rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .add-password-button:hover {
      background-color: #0056b3;
    }

    .password-items {
      min-height: 200px;
    }

    .no-passwords {
      text-align: center;
      color: #666;
      margin-top: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  hasPasswords: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Initialize dashboard data
  }

  logout() {
    this.authService.logout();
  }
} 