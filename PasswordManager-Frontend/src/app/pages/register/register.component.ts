import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-box">
        <h2>Register</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
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
              Please enter a username
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
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirmPasswordInput="ngModel"
            />
            <div *ngIf="confirmPasswordInput.invalid && (confirmPasswordInput.dirty || confirmPasswordInput.touched)" class="error-message">
              Please confirm your password
            </div>
            <div *ngIf="password !== confirmPassword && confirmPasswordInput.touched" class="error-message">
              Passwords do not match
            </div>
          </div>
          <button type="submit" [disabled]="registerForm.invalid || password !== confirmPassword">Register</button>
        </form>
        <p class="login-link">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at top, #a18cd1 0%, #fbc2eb 40%, #2d1e4a 100%);
      padding: 20px;
    }

    .register-box {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 2.5rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      width: 100%;
      max-width: 400px;
      animation: fadeIn 0.5s ease-out;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
      font-weight: 600;
      font-size: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      font-size: 1rem;
      color: white;
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #a18cd1;
      box-shadow: 0 0 0 2px rgba(161, 140, 209, 0.2);
    }

    input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .error-message {
      color: #ff6b6b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.3s ease;
    }

    button:disabled {
      background: rgba(255, 255, 255, 0.1);
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(161, 140, 209, 0.4);
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .login-link a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .login-link a:hover {
      color: #fbc2eb;
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.username && this.password && this.password === this.confirmPassword) {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          // Navigation will be handled by the auth service
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle registration error (you might want to show an error message to the user)
        }
      });
    }
  }
} 