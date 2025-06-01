import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordGeneratorComponent } from '../../components/password-generator/password-generator.component';
import { AddAccountComponent } from '../../components/add-account/add-account.component';
import { AccountService, Account } from '../../services/account.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PasswordGeneratorComponent, AddAccountComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-left">
          <span class="username">{{ username }}</span>
        </div>
        <h1 class="title">Password Manager</h1>
        <div class="header-right">
          <button (click)="deleteAccount()" class="delete-account-button">
            Delete Account
          </button>
          <button (click)="logout()" class="logout-button">Logout</button>
          <button class="theme-toggle" (click)="toggleTheme()">
            <i class="material-icons">{{
              currentTheme === 'astral' ? 'dark_mode' : 'light_mode'
            }}</i>
          </button>
        </div>
      </header>
      <main class="dashboard-content">
        <div class="password-list">
          <h2>Your Accounts</h2>
          <div class="password-actions">
            <button class="add-account-button" (click)="openAddAccount()">
              Add New Account
            </button>
            <button
              class="generate-password-button"
              (click)="openPasswordGenerator()"
            >
              Generate Password
            </button>
          </div>
          <div class="password-items">
            <div *ngIf="accounts.length === 0" class="no-accounts">
              No accounts saved yet. Add your first account!
            </div>
            <div *ngFor="let account of accounts" class="account-item">
              <div class="account-info">
                <h3>{{ account.accountName }}</h3>
                <p>{{ account.accountEmail }}</p>
              </div>
              <div class="account-actions">
                <button
                  class="show-password-button"
                  (click)="togglePassword(account)"
                >
                  {{ account.showPassword ? 'Hide' : 'Show' }} Password
                </button>
                <button
                  class="delete-button"
                  (click)="deleteAccountItem(account)"
                >
                  Delete
                </button>
              </div>
              <div *ngIf="account.showPassword" class="password-display">
                {{ account.accountPassword }}
              </div>
            </div>
          </div>
        </div>
      </main>
      <app-password-generator
        #passwordGenerator
        (passwordGenerated)="onPasswordGenerated($event)"
      ></app-password-generator>
      <app-add-account
        #addAccountModal
        (accountAdded)="loadAccounts()"
      ></app-add-account>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        background: var(--theme-bg);
        color: var(--theme-text);
      }

      .dashboard-header {
        background: var(--theme-glass);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        border-bottom: 1px solid var(--theme-border);
        position: relative;
      }

      .header-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .username {
        color: var(--theme-text);
        font-weight: 500;
        font-size: 1.1rem;
      }

      .theme-toggle {
        position: absolute;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
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
        transform: translateY(-50%) translateY(-2px);
        background: var(--theme-primary);
        color: white;
      }

      .theme-toggle i {
        font-size: 1.2rem;
      }

      .theme-toggle span {
        display: none;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: flex-end;
        margin-right: 60px;
      }

      .title {
        margin: 0;
        color: var(--theme-text);
        font-size: 1.5rem;
        text-align: center;
        font-weight: 600;
        grid-column: 2;
      }

      .delete-account-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(
          135deg,
          var(--theme-accent) 0%,
          #ff8e8e 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .delete-account-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--theme-accent);
      }

      .logout-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(
          135deg,
          var(--theme-primary) 0%,
          var(--theme-secondary) 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .logout-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--theme-primary);
      }

      .dashboard-content {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .password-list {
        background: var(--theme-glass);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1px solid var(--theme-border);
        padding: 2rem;
        box-shadow: 0 8px 32px 0 var(--theme-shadow);
      }

      h2 {
        margin: 0 0 1.5rem 0;
        color: var(--theme-text);
        font-weight: 600;
      }

      .password-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .add-account-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(
          135deg,
          var(--theme-primary) 0%,
          var(--theme-secondary) 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .add-account-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--theme-primary);
      }

      .generate-password-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(
          135deg,
          var(--theme-primary) 0%,
          var(--theme-secondary) 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .generate-password-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--theme-primary);
      }

      .password-items {
        min-height: 200px;
      }

      .no-accounts {
        text-align: center;
        color: var(--theme-text);
        margin-top: 2rem;
      }

      .account-item {
        background: var(--theme-glass);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--theme-border);
        transition: all 0.3s ease;
      }

      .account-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 32px 0 var(--theme-shadow);
        background: var(--theme-glass);
        opacity: 0.9;
      }

      .account-info {
        margin-bottom: 1rem;
      }

      .account-info h3 {
        margin: 0 0 0.5rem 0;
        color: var(--theme-text);
        font-weight: 600;
      }

      .account-info p {
        margin: 0;
        color: var(--theme-text);
        opacity: 0.8;
      }

      .account-actions {
        display: flex;
        gap: 1rem;
      }

      .show-password-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(
          135deg,
          var(--theme-primary) 0%,
          var(--theme-secondary) 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .show-password-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--theme-primary);
      }

      .delete-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(
          135deg,
          var(--theme-accent) 0%,
          #ff8e8e 100%
        );
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .delete-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--theme-accent);
      }

      .password-display {
        margin-top: 1rem;
        padding: 0.75rem;
        background: var(--theme-glass);
        border: 1px solid var(--theme-border);
        border-radius: 8px;
        font-family: monospace;
        color: var(--theme-text);
        font-weight: 500;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  accounts: (Account & { showPassword: boolean })[] = [];
  username: string = '';
  currentTheme: 'astral' | 'violet' = 'astral';

  @ViewChild('addAccountModal') addAccountModal!: AddAccountComponent;
  @ViewChild('passwordGenerator')
  passwordGenerator!: PasswordGeneratorComponent;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername() || '';
    this.loadAccounts();
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts.map((account) => ({
          ...account,
          showPassword: false,
        }));
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        if (error.status === 401) {
          this.authService.handleAuthError();
        }
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  deleteAccount() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        },
      });
    }
  }

  deleteAccountItem(account: Account) {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(account).subscribe({
        next: (response: string) => {
          console.log('Delete response:', response);
          this.loadAccounts();
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          if (error.status === 401) {
            this.authService.handleAuthError();
          }
        },
      });
    }
  }

  updateAccount(account: Account) {
    this.accountService.updateAccount(account).subscribe({
      next: (updatedAccount) => {
        console.log('Account updated:', updatedAccount);
        this.loadAccounts();
      },
      error: (error) => {
        console.error('Error updating account:', error);
        if (error.status === 401) {
          this.authService.handleAuthError();
        }
      },
    });
  }

  togglePassword(account: Account & { showPassword: boolean }) {
    account.showPassword = !account.showPassword;
  }

  openAddAccount() {
    this.addAccountModal.open();
  }

  openPasswordGenerator() {
    this.passwordGenerator.open();
  }

  onPasswordGenerated(password: string) {
    console.log('Generated password:', password);
  }
}
