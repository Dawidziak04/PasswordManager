import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'api/accounts'; // Base URL for accounts API

  constructor(private http: HttpClient) { }

  getAccountsByAppUser(appUserId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/getAccountsByAppUserId/${appUserId}`);
  }

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/addAccount`, account);
  }

  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/updateAccount`, account);
  }

  deleteAccount(account: Account): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/deleteAccount`, { body: account });
  }
} 