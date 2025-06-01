import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="password-generator-modal" *ngIf="isOpen">
      <div class="password-generator-content">
        <h2>Generate Password</h2>
        <div class="password-options">
          <div class="option">
            <label>
              <input type="checkbox" [(ngModel)]="options.upper" />
              Uppercase Letters
            </label>
          </div>
          <div class="option">
            <label>
              <input type="checkbox" [(ngModel)]="options.lower" />
              Lowercase Letters
            </label>
          </div>
          <div class="option">
            <label>
              <input type="checkbox" [(ngModel)]="options.digit" />
              Numbers
            </label>
          </div>
          <div class="option">
            <label>
              <input type="checkbox" [(ngModel)]="options.symbols" />
              Special Characters
            </label>
          </div>
          <div class="option">
            <label>
              Length:
              <input
                type="number"
                [(ngModel)]="options.length"
                min="8"
                max="32"
                class="length-input"
              />
            </label>
          </div>
        </div>
        <div class="generated-password" *ngIf="generatedPassword">
          <p>Generated Password:</p>
          <div class="password-display">{{ generatedPassword }}</div>
          <button class="copy-button" (click)="copyToClipboard()">
            <i class="material-icons">content_copy</i>
          </button>
        </div>
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="button-group">
          <button class="generate-button" (click)="generatePassword()">
            Generate Password
          </button>
          <button class="close-button" (click)="close()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .password-generator-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .password-generator-content {
      background: var(--theme-glass);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid var(--theme-border);
      box-shadow: 0 8px 32px 0 var(--theme-shadow);
      width: 90%;
      max-width: 500px;
      animation: fadeIn 0.3s ease-out;
    }

    h2 {
      color: var(--theme-text);
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 600;
    }

    .password-options {
      display: grid;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .option label {
      color: var(--theme-text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .length-input {
      width: 60px;
      padding: 0.25rem;
      border: 1px solid var(--theme-border);
      border-radius: 4px;
      background: var(--theme-glass);
      color: var(--theme-text);
    }

    .generated-password {
      background: var(--theme-glass);
      border: 1px solid var(--theme-border);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      position: relative;
    }

    .generated-password p {
      color: var(--theme-text);
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .password-display {
      font-family: monospace;
      font-size: 1.2rem;
      color: var(--theme-text);
      word-break: break-all;
      padding-right: 2rem;
    }

    .copy-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: var(--theme-text);
      cursor: pointer;
      padding: 0.25rem;
      transition: all 0.3s ease;
    }

    .copy-button:hover {
      color: var(--theme-primary);
      transform: scale(1.1);
    }

    .error-message {
      color: var(--theme-accent);
      margin-bottom: 1rem;
      text-align: center;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .generate-button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .generate-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px var(--theme-primary);
    }

    .close-button {
      padding: 0.75rem 1.5rem;
      background: var(--theme-glass);
      color: var(--theme-text);
      border: 1px solid var(--theme-border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .close-button:hover {
      background: var(--theme-primary);
      color: white;
      transform: translateY(-2px);
    }
  `]
})
export class PasswordGeneratorComponent {
  @Output() passwordGenerated = new EventEmitter<string>();
  
  isOpen = false;
  generatedPassword: string | null = null;
  errorMessage: string | null = null;
  
  options = {
    length: 16,
    upper: true,
    lower: true,
    digit: true,
    symbols: true
  };

  constructor(private passwordService: PasswordService) {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.generatedPassword = null;
    this.errorMessage = null;
  }

  generatePassword() {
    this.passwordService.generatePassword(this.options).subscribe({
      next: (password) => {
        this.generatedPassword = password;
        this.errorMessage = null;
        this.passwordGenerated.emit(password);
      },
      error: (error) => {
        console.error('Error generating password:', error);
        this.errorMessage = 'Failed to generate password. Please try again.';
      }
    });
  }

  copyToClipboard() {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword).then(() => {
        // You could add a visual feedback here
      }).catch(err => {
        console.error('Failed to copy password:', err);
      });
    }
  }
} 