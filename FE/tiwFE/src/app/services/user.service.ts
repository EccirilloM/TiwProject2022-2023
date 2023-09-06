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
  private followerCount: number = 0;
  public followerCountSubject = new BehaviorSubject<number>(0);

   constructor(private http: HttpClient, private authService: AuthService) { }

  getUserWithImage(username: string): Observable<any> {
    return this.getUser(username).pipe(
      map(user => {
        user.profileImage = `${this.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`;
        return user;
      })
    );
  }

  setFollowerCount(count: number) {
    this.followerCount = count;
  }

  getFollowerCount(): number {
    return this.followerCount;
  }

  updateFollowerCount(newCount: number) {
    this.followerCountSubject.next(newCount);
  }

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
    const currentUsername = this.authService.getUsernameLogged();
  
    return this.http.get<any[]>(`${this.backEndUrl}/api/user/${currentUsername}/following`, {
      headers: this.authService.getHttpHeaders(),
    }).pipe(
      map((following: any[]) => following.some((user: any) => user.username === username))
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/user/getAllUsers`, {
      headers: this.authService.getHttpHeaders(),
    });
  }

  searchUsers(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/search/user?term=${searchTerm}`, {
      headers: this.authService.getHttpHeaders()
    });
  }

  getTenRandomUsers(): Observable<any> {
    return this.http.get<any>(`${this.backEndUrl}/api/search/randomUsers`, {
        headers: this.authService.getHttpHeaders()
    });
  }

  handleFollow(followedId: string): Observable<any> {
    const headers = this.authService.getHttpHeaders();
    return this.http.post(`${this.backEndUrl}/api/user/handleFollow`, { followedId }, { headers });
  }


  checkLikeStatus(threadId: string): Observable<any> {
    const headers = this.authService.getHttpHeaders();
    return this.http.get<any>(`${this.backEndUrl}/api/user/likeStatus/${threadId}`, { headers });
  }

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