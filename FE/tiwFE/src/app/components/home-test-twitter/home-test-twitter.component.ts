import { Component, OnInit } from '@angular/core';
import { ThreadService } from 'src/app/services/thread.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service'; // Importa AuthService
import { Router } from '@angular/router';
import { LikeService } from 'src/app/services/like.service';

@Component({
  selector: 'app-home-test-twitter',
  templateUrl: './home-test-twitter.component.html',
  styleUrls: ['./home-test-twitter.component.css']
})
export class HomeTestTwitterComponent implements OnInit {
  public threads: any[] = [];
  public loggedInUser: any = null; // Variabile per mantenere le informazioni sull'utente loggato
  public newThreadTitle: string = ''; // Variabile per il titolo del nuovo thread


  constructor( private threadService: ThreadService, private userService: UserService, private authService: AuthService, private router: Router, private likeService: LikeService) { }

  ngOnInit(): void {
    this.loadThreads();
    this.loadUserLoggedBasicInfo();
  }
  
  // Metodo per caricare le informazioni dell'utente loggato
  loadUserLoggedBasicInfo(): void {
    const username = this.authService.getUsernameLogged();
    if(username) {
      this.userService.getUserBasicInfo(username).subscribe({
        next: data => {
          this.loggedInUser = data;
        },
        error: error => {
          console.error('Errore nel recuperare le informazioni utente:', error);
        }
      });
    }
  }

  loadThreads(): void {
    this.threadService.getAllThreadsFollowingAndOwn()
      .subscribe({
        next: data => {
          // Aggiorna l'URL dell'immagine del profilo per ogni thread
          this.threads = data.map((thread: { user: { profileImage: string; }; }) => {
            thread.user.profileImage = `${this.userService.backEndUrl}/profilePictures/${thread.user.profileImage}?${Date.now()}`;
            return thread;
          });
  
          // Ora controlla lo stato del like per ogni thread
          this.threads.forEach(thread => {
            this.likeService.checkLikeStatus(thread.id.toString(), "thread").subscribe({
              next: likeStatus => {
                thread.likeStatus = likeStatus.likeStatus; // 'like', 'dislike', or null
              },
              error: error => {
                console.error('Errore nel recuperare lo stato del like:', error);
              }
            });
          });
        },
        error: error => {
          console.error('Errore nel recuperare i thread:', error);
        }
      });
  }

  createThread() {
    if (!this.newThreadTitle) {
      console.error('Il titolo del thread non può essere vuoto.');
      return;
    }

    this.threadService.createThread(this.newThreadTitle).subscribe(
      response => {
        console.log('Thread creato con successo:', response);
        this.loadThreads(); // Aggiorna la lista dei thread
      },
      error => {
        console.error('Errore nella creazione del thread:', error);
      }
    );
  }

  navigateToThread(threadId: String): void{
    this.router.navigate(['/thread', threadId]);
  }

  handleLike(threadId: string): void {
    this.likeService.handleLikeComponents(threadId, 'thread', this.threads);  
  }  
    
  handleDislike(threadId: string): void {
    this.likeService.handleDislikeComponents(threadId, 'thread', this.threads);  
  }
  
}