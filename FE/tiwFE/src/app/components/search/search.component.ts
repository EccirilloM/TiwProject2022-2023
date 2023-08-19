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

  searchType: 'user' | 'thread' = 'user';
  results: any[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService, private threadsService: ThreadService, private router: Router){}

  toggleSearchType() {
    this.searchType = this.searchType === 'user' ? 'thread' : 'user';
    this.refresh();
  }

  getRandomResults() {
    const randomObservable = this.searchType === 'user'
      ? this.userService.getTenRandomUsers()
      : this.threadsService.getTenRandomThreads();

    randomObservable.subscribe(
        (data: any[]) => {
            if (this.searchType === 'user') {
                this.results = data.map(user => ({
                  ...user,
                  profileImageUrl: `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`,
                  followingCount: user.following.length,
                  followersCount: user.followers.length,
                  threadsCount: user.threads.length
                }));
            } else {
                this.results = data.map(thread => ({
                  ...thread,
                  createdAt: new Date(thread.createdAt).toLocaleDateString(),
                  likesCount: thread.likes.length,
                  dislikesCount: thread.dislikes.length,
                  messagesCount: thread.messages.length
                  // Aggiungi altri campi se necessario
                }));
            }
        },
        (error: any) => {
            console.error(`Errore nel recupero di ${this.searchType}s casuali:`, error);
        }
    );
  }

  search() {
    const searchObservable = this.searchType === 'user'
      ? this.userService.searchUsers(this.searchTerm)
      : this.threadsService.searchThreads(this.searchTerm);

    searchObservable.subscribe(
        (data: any[]) => {
            if (this.searchType === 'user') {
                this.results = data.map(user => ({
                  ...user,
                  profileImageUrl: `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`,
                  followingCount: user.following.length,
                  followersCount: user.followers.length,
                  threadsCount: user.threads.length
                }));
            } else {
                this.results = data.map(thread => ({
                  ...thread,
                  createdAt: new Date(thread.createdAt).toLocaleDateString(),
                  likesCount: thread.likes.length,
                  dislikesCount: thread.dislikes.length,
                  messagesCount: thread.messages.length
                  // Aggiungi altri campi se necessario
                }));
            }
        },
        (error: any) => {
            console.error(`Errore nella ricerca di ${this.searchType}s:`, error);
        }
    );
  }

  refresh() {
    this.searchTerm = '';
    this.getRandomResults();
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  navigateToThread(): void{
    
  }

  ngOnInit(): void {
    console.log("OnInit SeachComponent");
    this.getRandomResults();
  }
}
