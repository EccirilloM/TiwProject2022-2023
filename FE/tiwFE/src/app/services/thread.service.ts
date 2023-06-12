import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Assicurati che il percorso sia corretto.

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private backEndUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllThreadsFollowingAndOwn(): Observable<any> {
    const username = this.authService.getUsername();
    return this.http.get<any[]>(`${this.backEndUrl}/api/thread/${username}/followingAndOwn`, {
      headers: this.authService.getHttpHeaders()
    });
  }
}
