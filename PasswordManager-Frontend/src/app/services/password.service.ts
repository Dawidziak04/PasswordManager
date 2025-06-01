import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export interface PasswordOptions {
  length: number;
  lower: boolean;
  upper: boolean;
  digit: boolean;
  symbols: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPasswords(): Observable<PasswordEntry[]> {
    return this.http.get<PasswordEntry[]>(`${this.apiUrl}/passwords`, {
      headers: this.getHeaders()
    });
  }

  addPassword(password: Omit<PasswordEntry, 'id'>): Observable<PasswordEntry> {
    return this.http.post<PasswordEntry>(`${this.apiUrl}/passwords`, password, {
      headers: this.getHeaders()
    });
  }

  updatePassword(id: string, password: Partial<PasswordEntry>): Observable<PasswordEntry> {
    return this.http.put<PasswordEntry>(`${this.apiUrl}/passwords/${id}`, password, {
      headers: this.getHeaders()
    });
  }

  deletePassword(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/passwords/${id}`, {
      headers: this.getHeaders()
    });
  }

  generatePassword(options: PasswordOptions): Observable<string> {
    return this.http.post(`${this.apiUrl}/generatePassword`, options, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
} 