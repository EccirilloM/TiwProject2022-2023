import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-sidebar-test-twitter',
  templateUrl: './sidebar-test-twitter.component.html',
  styleUrls: ['./sidebar-test-twitter.component.css']
})
export class SidebarTestTwitterComponent {
  title: string = "ALIAS TWITTER";
  user: any = { username: '', email: '',name: '', surname: '', profileImage: ''};
  username: string = "";
  currentRoute: string = '';
  profileImageUrl:string='';

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.currentRoute = this.router.url.split('/')[1];
    this.username = this.authService.getUsernameLogged(); 
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: Event) => {
      let navigationEndEvent = event as NavigationEnd;
      this.currentRoute = navigationEndEvent.urlAfterRedirects.split('/')[1];
    });
    this.getUser();
  }

  getUser(): void {
    const username = this.authService.getUsernameLogged();
    if(username){
      this.userService.getUserWithImage(username).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    }
  }
  
  logout(): void {
    this.authService.logout();
  }

  goToProfileUserLogged(): void {
    const username = this.authService.getUsernameLogged();
  
    if (username) {
      this.router.navigate([`/profile/${username}`]);
    } else {
      console.log("Username non disponibile");  // Debug
    }
  }  
}
