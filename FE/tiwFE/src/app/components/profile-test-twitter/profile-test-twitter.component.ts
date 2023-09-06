import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';
import { EMPTY } from 'rxjs';
import { LikeService } from 'src/app/services/like.service';


@Component({
  selector: 'app-profile-test-twitter',
  templateUrl: './profile-test-twitter.component.html',
  styleUrls: ['./profile-test-twitter.component.css']
})
export class ProfileTestTwitterComponent {
  @ViewChild('profileImage') profileImage!: ElementRef;

  backgroundImageUrl: string= '';
  profileImageUrl = '';
  formattedJoinDate: string = '';
  isFollowing: boolean = false;  // Per tenere traccia se l'utente loggato sta seguendo o meno l'utente visualizzato
  currentUsername: string = ''; // Username dell'utente loggato

  // Serve per non darmi errori in console
  user: any = { username: '', email: '', name:'', surname: '', description: '', joinDate: '', profileImage: '',  };

  constructor(private userService: UserService, private zone: NgZone, private router: Router, private route: ActivatedRoute, private authService: AuthService, private likeService: LikeService) {}  // Inject ActivatedRoute service 


  
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const username = params.get('username');
        if (username === null) {
          return EMPTY;
        }
        return this.userService.getUser(username);
      })
    ).subscribe({
      next: user => this.handleUserData(user),
      error: err => console.error('Si è verificato un errore!', err),
    });
  }
  
  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userService.getUser(username).subscribe({
        next: user => this.handleUserData(user),
        error: error => console.error('There was an error!', error),
      });
    } else {
      this.router.navigate(['/404']);
    }
  }

  private handleUserData(user: any): void {
    this.currentUsername = this.authService.getUsernameLogged();
    this.user = user;
    this.user.profileImage = `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`;
    this.user.followersCount = user.followers.length;
    this.user.followingCount = user.following.length;
    this.user.threadsCount = user.threads.length;
    this.formattedJoinDate = user.joinedAt;
  
    // Ordina i thread in ordine decrescente per data di creazione
    if (user.threads) {
      user.threads.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    }
  
    let totalMessages = 0;
    if (user.threads) {  // Verifica che user.threads non sia undefined
      for (const thread of user.threads) {
        if (thread.messages) {  // Verifica che thread.messages non sia undefined
          totalMessages += thread.messages.length;
        }
      }
    }
    this.user.commentsCount = totalMessages;
  
    // Aggiunto: Controlla lo stato del "like" per ogni thread
    if (user.threads) { 
      user.threads.forEach((thread: { id: { toString: () => string; }; likeStatus: any; }) => {
    
        this.likeService.checkLikeStatus(thread.id.toString(), "thread").subscribe({
          next: likeStatus => {
            thread.likeStatus = likeStatus.likeStatus;
          },
          error: error => {
            console.error('Errore nel recuperare lo stato del like:', error);
          }
        });
      });
    }
    
    // Fine della sezione aggiunta
  }

  onProfileImageClick() {
    // Verifica se l'username dell'utente loggato corrisponde all'username del profilo visualizzato
    if (this.currentUsername === this.user.username) {
      this.router.navigate(['/confirmChangeImageProfile']);
    } else {
      console.log("Non hai i permessi per cambiare questa immagine del profilo.");
      // Qui puoi anche mostrare un messaggio all'utente, se necessario
    }
  }  

  handleFollow(user: any) {
    this.userService.handleFollow(user.id).subscribe({
      next: response => {
        user.isFollowing = !user.isFollowing;
      },
      error: err => {
        console.error("Si è verificato un errore durante il follow/unfollow", err);
      }
    });
  }

  navigateToThread(threadId: String): void{
    this.router.navigate(['/thread', threadId]);
  }

  // Aggiunge queste funzioni
  handleLike(threadId: string): void {
    this.likeService.handleLikeComponents(threadId, 'thread', this.user.threads);  
  }
  
  handleDislike(threadId: string): void {
    this.likeService.handleDislikeComponents(threadId, 'thread', this.user.threads);  
  }
  
}


// formatDate(dateString: string): string {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       throw new Error("Invalid Date");
//     }

//     const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//     const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

//     const formattedDate = date.toLocaleDateString(undefined, dateOptions);
//     const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

//     return `${formattedDate} at ${formattedTime}`;

//   } catch (e) {
//     console.error("Data non valida", e);
//     return "Data sconosciuta";
//   }
// }  