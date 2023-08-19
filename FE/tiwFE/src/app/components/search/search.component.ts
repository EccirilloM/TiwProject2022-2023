import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ThreadService } from 'src/app/services/thread.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  isUserSearchEnabled: boolean = false;

  users: any []= [];
  searchTerm: string = '';

  constructor(private userService: UserService, private threadsService: ThreadService, private router: Router){};
  
  toggleUserThreadSearch() {
    this.isUserSearchEnabled = !this.isUserSearchEnabled;
    console.log(`User filter enabled: ${this.isUserSearchEnabled}`);
  }

  getRandomUsers() {
    this.userService.getTenRandomUsers().subscribe(
      (data: any[]) => {  // next
        this.users = data.map(user => ({
          ...user,
          profileImageUrl: `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`,
          followingCount: user.following.length,
          followersCount: user.followers.length,
          threadsCount: user.threads.length,
        }));
      },
      (error: any) => {  // error
        console.error('Errore nel recupero degli utenti random:', error);
      }
    );
  }

  refresh() {
    this.searchTerm = ''; // svuota la inputbox
    this.getRandomUsers(); // ottieni 10 utenti casuali
  }

  

  search() {
    if (this.searchTerm.length > 0) {
      this.userService.searchUsers(this.searchTerm).subscribe(
        (data: any[]) => {  // next
          this.users = data.map(user => ({
            ...user,
            profileImageUrl: `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`,
            followingCount: user.following.length,
            followersCount: user.followers.length,
            threadsCount: user.threads.length
          }));
        },
        (error: any) => {  // error
          console.error('Errore nella ricerca degli utenti:', error);
        }
      );
    } else {
      this.getRandomUsers(); // se la inputbox è vuota, ottieni utenti casuali
    }
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }
  
  ngOnInit(): void {
    console.log("OnInit SearchComponent");
    this.getRandomUsers();  // all'inizializzazione, ottieni utenti casuali
  }
}

// getAllUsers() {
//   this.UserService.getAllUsers().subscribe(
//     (data: any[]) => {  // next
//       this.users = data.map(user => ({
//         ...user,
//         followingCount: user.following.length,
//         followersCount: user.followers.length,
//         threadsCount: user.threads.length
//       }));
//     },
//     (error: any) => {  // error
//       console.error('Errore nel recupero degli utenti:', error);
//     }
//   );
// }