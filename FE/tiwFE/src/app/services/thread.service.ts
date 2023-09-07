import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Assicurati che il percorso sia corretto.

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private backEndUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllThreadsFollowingAndOwn(): Observable<any> {
    return this.http.get<any[]>(`${this.backEndUrl}/api/thread/followingAndOwn`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  searchThreads(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/search/thread?term=${searchTerm}`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  getTenRandomThreads(): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/search/randomThreads`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  createThread(title: string): Observable<any> {
    return this.http.post<any>(`${this.backEndUrl}/api/user/createThread`, { title }, {
      headers: this.authService.getHttpHeaders()
    });
  }

  getThreadInfo(threadId: number): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/thread/${threadId}/info`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  // Ottieni tutti i messaggi di un thread specifico
  getThreadMessages(threadId: number): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/thread/${threadId}/messages`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  // Ottieni tutti i commenti di un messaggio specifico
  getMessageComments(messageId: number): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/thread/getMessageComments/${messageId}`, {
      headers: this.authService.getHttpHeaders()
    });
  }
}

