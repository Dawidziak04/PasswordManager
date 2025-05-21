import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = 'http://localhost:3000/api'; // adjust this to your backend URL

  constructor(private http: HttpClient) {}

  getPasswords(): Observable<PasswordEntry[]> {
    return this.http.get<PasswordEntry[]>(`${this.apiUrl}/passwords`);
  }

  addPassword(password: Omit<PasswordEntry, 'id'>): Observable<PasswordEntry> {
    return this.http.post<PasswordEntry>(`${this.apiUrl}/passwords`, password);
  }

  updatePassword(id: string, password: Partial<PasswordEntry>): Observable<PasswordEntry> {
    return this.http.put<PasswordEntry>(`${this.apiUrl}/passwords/${id}`, password);
  }

  deletePassword(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/passwords/${id}`);
  }

  generatePassword(params: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSpecial: boolean;
  }): Observable<{ password: string }> {
    return this.http.post<{ password: string }>(`${this.apiUrl}/generate-password`, params);
  }
} 