import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              #usernameInput="ngModel"
            />
            <div *ngIf="usernameInput.invalid && (usernameInput.dirty || usernameInput.touched)" class="error-message">
              Please enter your username
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              #passwordInput="ngModel"
            />
            <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="error-message">
              Please enter your password
            </div>
          </div>
          <button type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>
        <p class="register-link">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .register-link {
      text-align: center;
      margin-top: 1rem;
      color: #666;
    }

    .register-link a {
      color: #007bff;
      text-decoration: none;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          // Navigation will be handled by the auth service
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Handle login error (you might want to show an error message to the user)
        }
      });
    }
  }
} 