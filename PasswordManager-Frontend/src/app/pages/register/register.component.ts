import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="theme-toggle-container">
          <button class="theme-toggle" (click)="toggleTheme()">
            <i class="material-icons">{{
              currentTheme === 'astral' ? 'dark_mode' : 'light_mode'
            }}</i>
          </button>
        </div>
        <h1>Register</h1>
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
              minlength="8"
              #passwordInput="ngModel"
            />
            <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="error-message">
              Password must be at least 8 characters long
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
          <div class="form-actions">
            <button type="submit" [disabled]="registerForm.invalid || password !== confirmPassword">
              Register
            </button>
            <button type="button" class="login-link" (click)="navigateToLogin()">
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--theme-bg);
      padding: 2rem;
    }

    .register-card {
      background: var(--theme-glass);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid var(--theme-border);
      width: 100%;
      max-width: 500px;
      position: relative;
    }

    .theme-toggle-container {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--theme-text);
    }

    .theme-toggle:hover {
      transform: translateY(-2px);
      background: var(--theme-primary);
      color: white;
    }

    .theme-toggle i {
      font-size: 1.2rem;
    }

    h1 {
      margin: 0 0 2rem 0;
      color: var(--theme-text);
      font-weight: 600;
      text-align: center;
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

    .error-message {
      color: var(--theme-accent);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    button[type="submit"] {
      background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
      color: white;
    }

    button[type="submit"]:disabled {
      background: var(--theme-glass);
      cursor: not-allowed;
    }

    button[type="submit"]:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px var(--theme-primary);
    }

    .login-link {
      background: var(--theme-glass);
      color: var(--theme-text);
      border: 1px solid var(--theme-border);
    }

    .login-link:hover {
      background: var(--theme-glass);
      opacity: 0.8;
    }
  `]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  currentTheme: 'astral' | 'violet' = 'astral';

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onSubmit() {
    if (this.password === this.confirmPassword) {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
} 