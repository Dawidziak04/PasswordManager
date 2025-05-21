import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface GeneratedPassword {
  lower: boolean;
  upper: boolean;
  digit: boolean;
  symbols: boolean;
  length: number;
}

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="generator-container" [class.open]="isOpen">
      <button class="toggle-button" (click)="toggleMenu()">
        <span class="material-icons">{{ isOpen ? 'close' : 'menu' }}</span>
      </button>
      <div class="generator-content">
        <h3>Password Generator</h3>
        <div class="form-group">
          <label>
            <input type="checkbox" [(ngModel)]="options.lower">
            Lowercase letters
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" [(ngModel)]="options.upper">
            Uppercase letters
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" [(ngModel)]="options.digit">
            Numbers
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" [(ngModel)]="options.symbols">
            Special characters
          </label>
        </div>
        <div class="form-group">
          <label for="length">Length</label>
          <input type="number" id="length" [(ngModel)]="options.length" min="4" max="32">
        </div>
        <button (click)="generatePassword()" [disabled]="!isValidOptions()">Generate</button>
        <div *ngIf="generatedPassword" class="generated-password">
          <p>Generated Password:</p>
          <div class="password-display">
            <span>{{ generatedPassword }}</span>
            <button (click)="copyToClipboard()">Copy</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .generator-container {
      position: fixed;
      left: -300px;
      top: 0;
      height: 100vh;
      width: 300px;
      background: white;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      transition: left 0.3s ease;
      z-index: 1000;
    }

    .generator-container.open {
      left: 0;
    }

    .toggle-button {
      position: absolute;
      right: -40px;
      top: 20px;
      background: white;
      border: none;
      border-radius: 0 4px 4px 0;
      padding: 10px;
      cursor: pointer;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .generator-content {
      padding: 20px;
    }

    h3 {
      margin-bottom: 20px;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    input[type="number"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      width: 100%;
      padding: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .generated-password {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .password-display {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    .password-display span {
      flex: 1;
      font-family: monospace;
      padding: 8px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .password-display button {
      width: auto;
      margin: 0;
    }
  `]
})
export class PasswordGeneratorComponent {
  isOpen = false;
  options: GeneratedPassword = {
    lower: true,
    upper: true,
    digit: true,
    symbols: true,
    length: 12
  };
  generatedPassword: string | null = null;

  constructor(private http: HttpClient) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  isValidOptions(): boolean {
    return this.options.lower || this.options.upper || this.options.digit || this.options.symbols;
  }

  generatePassword() {
    this.http.post<{ password: string }>('http://localhost:8080/api/generatePassword', this.options)
      .subscribe({
        next: (response) => {
          this.generatedPassword = response.password;
        },
        error: (error) => {
          console.error('Error generating password:', error);
        }
      });
  }

  copyToClipboard() {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword);
    }
  }
} 