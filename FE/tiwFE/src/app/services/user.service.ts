import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backEndUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/user/getUser`, {
      headers: this.authService.getHttpHeaders(),
    });
  }
}
