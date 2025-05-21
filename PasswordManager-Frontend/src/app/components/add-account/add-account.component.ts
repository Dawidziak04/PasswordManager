import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Account } from '../../services/account.service';

@Component({
  selector: 'app-add-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [class.show]="isOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Account</h2>
          <button class="close-button" (click)="close()">×</button>
        </div>
        <form (ngSubmit)="onSubmit()" #accountForm="ngForm">
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
              Please enter an account name
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
              email
              #accountEmailInput="ngModel"
            />
            <div *ngIf="accountEmailInput.invalid && (accountEmailInput.dirty || accountEmailInput.touched)" class="error-message">
              Please enter a valid email address
            </div>
          </div>
          <div class="form-group">
            <label for="accountPassword">Password</label>
            <input
              type="password"
              id="accountPassword"
              name="accountPassword"
              [(ngModel)]="account.accountPassword"
              required
              #accountPasswordInput="ngModel"
            />
            <div *ngIf="accountPasswordInput.invalid && (accountPasswordInput.dirty || accountPasswordInput.touched)" class="error-message">
              Please enter a password
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-button" (click)="close()">Cancel</button>
            <button type="submit" [disabled]="accountForm.invalid">Add Account</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }

    .modal.show {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      position: relative;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
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

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    button[type="submit"] {
      background-color: #007bff;
      color: white;
    }

    button[type="submit"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button[type="submit"]:not(:disabled):hover {
      background-color: #0056b3;
    }

    .cancel-button {
      background-color: #6c757d;
      color: white;
    }

    .cancel-button:hover {
      background-color: #5a6268;
    }
  `]
})
export class AddAccountComponent {
  isOpen = false;
  account: Account = {
    accountName: '',
    accountEmail: '',
    accountPassword: ''
  };

  @Output() accountAdded = new EventEmitter<void>();

  constructor(private accountService: AccountService) {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.resetForm();
  }

  private resetForm() {
    this.account = {
      accountName: '',
      accountEmail: '',
      accountPassword: ''
    };
  }

  onSubmit() {
    if (this.account.accountName && this.account.accountEmail && this.account.accountPassword) {
      this.accountService.addAccount(this.account).subscribe({
        next: () => {
          this.close();
          this.accountAdded.emit();
        },
        error: (error) => {
          console.error('Error adding account:', error);
        }
      });
    }
  }
} 