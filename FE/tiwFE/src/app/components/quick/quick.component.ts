import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ThreadService } from 'src/app/services/thread.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css']
})
export class QuickComponent implements OnInit{

  threadResults: any[] = [];
  userResults: any[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService, private threadsService: ThreadService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.performSearch();
  }

  performSearch() {
    const currentUsername = this.authService.getUsernameLogged(); // Ottieni l'username dell'utente loggato
  
    // Eseguire la ricerca per gli utenti
    this.userService.searchUsers(this.searchTerm).subscribe({
      next: (userData: any[]) => {
        this.userResults = userData
          .filter(user => user.username !== currentUsername)
          .map(user => {
            if (!user.profileImage) {
              console.warn(`profileImage è null o undefined per l'utente: ${user.username}`);
            }
            return {
              ...user,
              isFollowing: user.isFollowing,  // Usa il campo 'isFollowing' dal tuo back-end
              profileImageUrl: user.profileImage 
                ? `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`
                : 'URL dell’immagine predefinita qui'
            };
          });
      },
      error: (err) => {
        console.error(`Errore nella ricerca degli utenti:`, err);
      }
    });
    
    

      // Eseguire la ricerca per i thread
    this.threadsService.searchThreads(this.searchTerm).subscribe({
      next: (threadData: any[]) => {
        this.threadResults = threadData.map(thread => ({
          ...thread,
          createdAt: new Date(thread.createdAt)
        }));
      },
      error: (err) => {
        console.error("Errore nella ricerca dei thread:", err);  // Logga qualsiasi errore
      }
    });
  }

  onSearchTermChanged() {
    this.performSearch();
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  navigateToThread(threadId: String): void{
    this.router.navigate(['/thread', threadId]);
  }
  
  handleFollow(user: any) {
    this.userService.handleFollow(user.id).subscribe(
      response => {
        user.isFollowing = !user.isFollowing;  // Aggiorna lo stato di "following"
      },
      error => {
        console.error("Si è verificato un errore durante il follow/unfollow", error);
      }
    );
  }
}
