import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Aggiungi HttpClient
import { AuthService } from './auth.service';  // Aggiungi AuthService
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LikeService {

  public backEndUrl = "http://localhost:3000";

  constructor( private http: HttpClient, private authService: AuthService ) { }

  handleLikeComponents(entityId: string, entityType: string, entities: any[]): void {
    console.log('Handle Like/Dislike called for entityId:', entityId);
    this.handleLike(entityId, entityType).subscribe({
      next: response => {
        const entity = entities.find(e => e.id === entityId);
        if (entity) {
          if (response.message === 'Like added') {
            entity.likeCount++;
            entity.likeStatus = 'like';
          } else if (response.message === 'Like removed') {
            entity.likeCount--;
            entity.likeStatus = null;
          }
        }
      },
      error: error => {
        console.error(`Errore nel mettere like: ${error}`);
      }
    });
  }
  
  handleDislikeComponents(entityId: string, entityType: string, entities: any[]): void {
    console.log('Handle Like/Dislike called for entityId:', entityId);
    this.handleDislike(entityId, entityType).subscribe({
      next: response => {
        const entity = entities.find(e => e.id === entityId);
        if (entity) {
          if (response.message === 'Dislike added') {
            entity.dislikeCount++;
            entity.likeStatus = 'dislike';
          } else if (response.message === 'Dislike removed') {
            entity.dislikeCount--;
            entity.likeStatus = null;
          }
        }
      },
      error: error => {
        console.error(`Errore nel mettere dislike: ${error}`);
      }
    });
  }  

  handleLike(entityId: string, entityType: string): Observable<any> {
    const headers = this.authService.getHttpHeaders();
    return this.http.post(`${this.backEndUrl}/api/user/like`, { entityId, entityType }, { headers });
  }
  
  handleDislike(entityId: string, entityType: string): Observable<any> {
    const headers = this.authService.getHttpHeaders();
    return this.http.post(`${this.backEndUrl}/api/user/dislike`, { entityId, entityType }, { headers });
  }

  checkLikeStatus(entityId: string, entityType: 'thread' | 'message' | 'comment'): Observable<any> {
    const headers = this.authService.getHttpHeaders();
    return this.http.get<any>(`${this.backEndUrl}/api/user/likeStatus/${entityType}/${entityId}`, { headers });
  } 
}
