import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Account {
  accountID: number;
  accountName: string;
  accountEmail: string;
  accountPassword: string;
  appUserProfileID?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/getAccountsByAppUserId`, {
      headers: this.getHeaders()
    });
  }

  addAccount(account: Omit<Account, 'accountID'>): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/addAccount`, account, {
      headers: this.getHeaders()
    });
  }

  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/updateAccount`, account, {
      headers: this.getHeaders()
    });
  }

  deleteAccount(account: Account): Observable<string> {
    return this.http.delete(`${this.apiUrl}/deleteAccount`, {
      headers: this.getHeaders(),
      body: account,
      responseType: 'text'
    });
  }
}
