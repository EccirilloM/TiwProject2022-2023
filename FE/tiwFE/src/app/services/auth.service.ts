import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backEndUrl = 'http://localhost:3000';
  private isAuthenticatedSource = new BehaviorSubject<boolean>(this.checkIsAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  setIsAuthenticated(value: boolean) {
    this.isAuthenticatedSource.next(value);
  }

  checkIsAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  registration(personData: any): Observable<any> {
    return this.http
      .post<any>(`${this.backEndUrl}/api/auth/registration`, personData)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.setIsAuthenticated(false);
        })
      );
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    const headers = this.getHttpHeaders();
    console.log('Headers:', headers); // You can remove this log if not needed
  
    return this.http
      .post<any>(`${this.backEndUrl}/api/auth/login`, credentials)
      .pipe(
        tap((response) => {
          console.log('login response:', response); // You can remove this log if not needed
          localStorage.setItem('token', response.token);
          localStorage.setItem("username", response.username);
          this.setIsAuthenticated(true);
        })
      );
  }
  
  logout(): void {
    localStorage.clear();
    this.setIsAuthenticated(false);
    this.router.navigate(['/login']);
  }

  getHttpHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }
}
