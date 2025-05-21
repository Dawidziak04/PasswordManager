import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  accountID: number;
  accountName: string;
  accountEmail: string;
  accountPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  addAccount(account: Omit<Account, 'accountID'>): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/addAccount`, account);
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`);
  }

  deleteAccount(accountId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/accounts/${accountId}`);
  }
} 