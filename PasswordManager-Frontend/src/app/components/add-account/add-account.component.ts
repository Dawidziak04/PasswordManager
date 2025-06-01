import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Account } from '../../services/account.service';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>{{ isEditMode ? 'Edit Account' : 'Add New Account' }}</h2>
        <form (ngSubmit)="onSubmit()" #addForm="ngForm">
          <div class="form-group">
            <label for="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              [(ngModel)]="account.accountName"
              required
              #accountNameInput="ngModel"
            />
            <div *ngIf="accountNameInput.invalid && (accountNameInput.dirty || accountNameInput.touched)" class="error-message">
              Please enter account name
            </div>
          </div>
          <div class="form-group">
            <label for="accountEmail">Email</label>
            <input
              type="email"
              id="accountEmail"
              name="accountEmail"
              [(ngModel)]="account.accountEmail"
              required
              #accountEmailInput="ngModel"
            />
            <div *ngIf="accountEmailInput.invalid && (accountEmailInput.dirty || accountEmailInput.touched)" class="error-message">
              Please enter a valid email
            </div>
          </div>
          <div class="form-group">
            <label for="accountPassword">Password</label>
            <div class="password-input-container">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="accountPassword"
                name="accountPassword"
                [(ngModel)]="account.accountPassword"
                required
                #accountPasswordInput="ngModel"
              />
              <button type="button" class="toggle-password" (click)="togglePassword()">
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            <div *ngIf="accountPasswordInput.invalid && (accountPasswordInput.dirty || accountPasswordInput.touched)" class="error-message">
              Please enter password
            </div>
          </div>
          <div class="button-group">
            <button type="button" class="cancel-button" (click)="close()">Cancel</button>
            <button type="submit" [disabled]="addForm.invalid">
              {{ isEditMode ? 'Update' : 'Add Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--theme-glass);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid var(--theme-border);
      width: 90%;
      max-width: 500px;
      animation: fadeIn 0.3s ease-out;
    }

    h2 {
      margin: 0 0 1.5rem 0;
      color: var(--theme-text);
      font-weight: 600;
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

    .password-input-container {
      position: relative;
      display: flex;
      align-items: center;
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

    .toggle-password {
      position: absolute;
      right: 0.5rem;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--theme-text);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .toggle-password:hover {
      color: var(--theme-primary);
    }

    .toggle-password i {
      font-size: 1.2rem;
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

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      flex: 1;
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

    .cancel-button {
      background: var(--theme-glass);
      color: var(--theme-text);
      border: 1px solid var(--theme-border);
    }

    .cancel-button:hover {
      background: var(--theme-glass);
      opacity: 0.8;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AddAccountComponent {
  isOpen = false;
  isEditMode = false;
  showPassword = false;
  @Output() accountAdded = new EventEmitter<void>();
  @Output() accountUpdated = new EventEmitter<Account>();

  account: Account = {
    accountID: 0,
    accountName: '',
    accountEmail: '',
    accountPassword: ''
  };

  constructor(private accountService: AccountService) {}

  open(account?: Account) {
    this.isOpen = true;
    this.isEditMode = !!account;
    if (account) {
      this.account = { ...account };
      this.showPassword = true;
    } else {
      this.resetForm();
    }
  }

  close() {
    this.isOpen = false;
    this.isEditMode = false;
    this.showPassword = false;
    this.resetForm();
  }

  private resetForm() {
    this.account = {
      accountID: 0,
      accountName: '',
      accountEmail: '',
      accountPassword: ''
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.isEditMode) {
      this.accountUpdated.emit(this.account);
      this.close();
    } else {
      const newAccount: Omit<Account, 'accountID'> = {
        accountName: this.account.accountName,
        accountEmail: this.account.accountEmail,
        accountPassword: this.account.accountPassword
      };
      
      this.accountService.addAccount(newAccount).subscribe({
        next: () => {
          this.accountAdded.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error adding account:', error);
        }
      });
    }
  }
} 