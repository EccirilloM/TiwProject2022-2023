import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public backEndUrl = "http://localhost:3000";

   constructor(private http: HttpClient, private authService: AuthService) { }

  //GETTER PER UTENTI
  getUserAllInfo(username: string): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/user/getUserAllInfo/${username}`, {
      headers: this.authService.getHttpHeaders(),
    });
  }  

  // Nel tuo UserService
  getUserBasicInfo(username: string): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/user/getUserBasicInfo/${username}`).pipe(
      map(user => {
        user.profileImage = `${this.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`;
        return user;
      })
    );
  }

  //UPDATE IMMAGINE PROFILO
  updateProfileImage(username: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('photo', image);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post(`${this.backEndUrl}/api/user/updateProfileImage`, formData, { headers });
  }

  //RICERCA UTENTE
  searchUsers(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/search/user?term=${searchTerm}`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  //FOLLOW
  handleFollow(followedId: string): Observable<any> {
    const headers = this.authService.getHttpHeaders();
    return this.http.post(`${this.backEndUrl}/api/user/handleFollow`, { followedId }, { headers });
  }

  isFollowing(username: string): Observable<boolean> {
    const currentUsername = this.authService.getUsernameLogged();
  
    return this.http.get<any[]>(`${this.backEndUrl}/api/user/${currentUsername}/following`, {
      headers: this.authService.getHttpHeaders(),
    }).pipe(
      map((following: any[]) => following.some((user: any) => user.username === username))
    );
  }

  //CREATE 
  createMessage(text: string, threadId: number): Observable<any> {
    const formData = new FormData();
    formData.append('text', text);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post(`${this.backEndUrl}/api/user/createMessage/${threadId}`, formData, { headers });
  }

  uploadMessageImage(messageId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    
    return this.http.post(`${this.backEndUrl}/api/user/uploadMessageImage/${messageId}`, formData, { headers });
  }

  createComment(text: string, messageId: number): Observable<any> {
    return this.http.post<any>(`${this.backEndUrl}/api/user/createComment/${messageId}`, { text }, {
      headers: this.authService.getHttpHeaders()
    });
  }
}