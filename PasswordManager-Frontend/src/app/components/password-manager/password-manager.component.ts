import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-password-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss']
})
export class PasswordManagerComponent implements OnInit {
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  isEditing = false;
  
  // Password generator settings
  passwordLength = 12;
  useLowercase = true;
  useUppercase = true;
  useDigits = true;
  useSymbols = true;
  generatedPassword = '';

  // TODO: Replace with actual user ID from your authentication service
  private currentUserId = 1;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccountsByAppUser(this.currentUserId).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        // Handle error appropriately
      }
    });
  }

  selectAccount(account: Account): void {
    this.selectedAccount = { ...account };
    this.isEditing = true;
  }

  deleteAccount(account: Account): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(account).subscribe({
        next: (response) => {
          console.log(response); // Success message from backend
          this.loadAccounts();
          this.selectedAccount = null;
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          // Handle error appropriately
        }
      });
    }
  }

  saveAccount(account: Account): void {
    // Ensure userId is set
    account.userId = this.currentUserId;

    if (account.id) {
      this.accountService.updateAccount(account).subscribe({
        next: (updatedAccount) => {
          this.loadAccounts();
          this.isEditing = false;
          this.selectedAccount = null;
        },
        error: (error) => {
          console.error('Error updating account:', error);
          // Handle error appropriately
        }
      });
    } else {
      this.accountService.addAccount(account).subscribe({
        next: (newAccount) => {
          this.loadAccounts();
          this.isEditing = false;
          this.selectedAccount = null;
        },
        error: (error) => {
          console.error('Error creating account:', error);
          // Handle error appropriately
        }
      });
    }
  }

  generatePassword(): void {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (this.useLowercase) chars += lowercase;
    if (this.useUppercase) chars += uppercase;
    if (this.useDigits) chars += digits;
    if (this.useSymbols) chars += symbols;

    if (chars.length === 0) {
      this.generatedPassword = 'Please select at least one character type';
      return;
    }

    let password = '';
    for (let i = 0; i < this.passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    this.generatedPassword = password;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Password copied to clipboard!');
    });
  }

  createNewAccount(): void {
    this.selectedAccount = {
      id: 0,
      userId: this.currentUserId,
      accountName: '',
      accountEmail: '',
      accountPassword: ''
    };
    this.isEditing = true;
  }
} 