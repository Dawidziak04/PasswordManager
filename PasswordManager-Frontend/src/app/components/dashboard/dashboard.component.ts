import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordService, PasswordEntry } from '../../services/password.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DashboardComponent implements OnInit {
  passwords: PasswordEntry[] = [];
  passwordForm: FormGroup;
  generatorForm: FormGroup;
  isGeneratorOpen = false;
  generatedPassword: string = '';
  editingPassword: PasswordEntry | null = null;
  showPassword: { [key: string]: boolean } = {};

  constructor(
    private passwordService: PasswordService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      title: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      url: [''],
      notes: ['']
    });

    this.generatorForm = this.fb.group({
      length: [16, [Validators.required, Validators.min(8), Validators.max(64)]],
      includeUppercase: [true],
      includeLowercase: [true],
      includeNumbers: [true],
      includeSpecial: [true]
    });
  }

  ngOnInit(): void {
    this.loadPasswords();
  }

  loadPasswords(): void {
    this.passwordService.getPasswords().subscribe({
      next: (passwords) => {
        this.passwords = passwords;
      },
      error: (error) => {
        console.error('Error loading passwords:', error);
      }
    });
  }

  toggleGenerator(): void {
    this.isGeneratorOpen = !this.isGeneratorOpen;
  }

  generatePassword(): void {
    if (this.generatorForm.valid) {
      this.passwordService.generatePassword(this.generatorForm.value).subscribe({
        next: (response) => {
          this.generatedPassword = response.password;
          this.passwordForm.patchValue({ password: response.password });
        },
        error: (error) => {
          console.error('Error generating password:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      
      if (this.editingPassword) {
        this.passwordService.updatePassword(this.editingPassword.id, passwordData).subscribe({
          next: () => {
            this.loadPasswords();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating password:', error);
          }
        });
      } else {
        this.passwordService.addPassword(passwordData).subscribe({
          next: () => {
            this.loadPasswords();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error adding password:', error);
          }
        });
      }
    }
  }

  editPassword(password: PasswordEntry): void {
    this.editingPassword = password;
    this.passwordForm.patchValue(password);
  }

  deletePassword(id: string): void {
    if (confirm('Are you sure you want to delete this password?')) {
      this.passwordService.deletePassword(id).subscribe({
        next: () => {
          this.loadPasswords();
        },
        error: (error) => {
          console.error('Error deleting password:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.passwordForm.reset();
    this.editingPassword = null;
  }

  togglePasswordVisibility(id: string): void {
    this.showPassword[id] = !this.showPassword[id];
  }

  logout(): void {
    this.authService.logout();
  }
} 