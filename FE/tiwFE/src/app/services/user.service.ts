import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public backEndUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/user/getUser/${username}`, {
      headers: this.authService.getHttpHeaders(),
    });
  }  

  updatePhoto(username: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('photo', image);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
    });

    return this.http.post(`${this.backEndUrl}/api/user/updatePhoto`, formData, { headers });
  }

  isFollowing(username: string): Observable<boolean> {
    const currentUsername = this.authService.getUsername();
  
    return this.http.get<any[]>(`${this.backEndUrl}/api/user/${currentUsername}/following`, {
      headers: this.authService.getHttpHeaders(),
    }).pipe(
      map((following: any[]) => following.some((user: any) => user.username === username))
    );
  }
  
}
