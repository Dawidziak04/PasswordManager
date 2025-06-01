import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <button class="theme-toggle" (click)="toggleTheme()">
        <i class="material-icons">{{ currentTheme === 'astral' ? 'dark_mode' : 'light_mode' }}</i>
      </button>
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
      background: var(--theme-bg);
      padding: 20px;
    }

    .login-box {
      background: var(--theme-glass);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 2.5rem;
      border-radius: 16px;
      border: 1px solid var(--theme-border);
      box-shadow: 0 8px 32px 0 var(--theme-shadow);
      width: 100%;
      max-width: 400px;
      animation: fadeIn 0.5s ease-out;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--theme-text);
      font-weight: 600;
      font-size: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--theme-text);
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 8px;
      font-size: 1rem;
      color: var(--theme-text);
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: var(--theme-primary);
      box-shadow: 0 0 0 2px var(--theme-primary);
    }

    input::placeholder {
      color: var(--theme-text);
      opacity: 0.5;
    }

    .error-message {
      color: var(--theme-accent);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
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
      background: var(--theme-glass);
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px var(--theme-primary);
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--theme-text);
      opacity: 0.7;
    }

    .register-link a {
      color: var(--theme-text);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .register-link a:hover {
      color: var(--theme-secondary);
      text-decoration: underline;
    }

    .theme-toggle {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--theme-text);
    }

    .theme-toggle:hover {
      transform: scale(1.1);
      background: var(--theme-primary);
      color: white;
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  currentTheme: 'astral' | 'violet' = 'astral';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

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