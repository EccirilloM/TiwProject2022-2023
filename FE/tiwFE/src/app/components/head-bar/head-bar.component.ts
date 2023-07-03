import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.css']
})
export class HeadbarComponent implements OnInit {
  currentRoute: string = '';
  title: string = "ALIAS TWITTER";
  username: string = "";

  constructor(private router: Router, private authService: AuthService) {
    this.currentRoute = this.router.url.split('/')[1];
    this.username = this.authService.getUsername(); 
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: Event) => {
      let navigationEndEvent = event as NavigationEnd;
      this.currentRoute = navigationEndEvent.urlAfterRedirects.split('/')[1];
    });
  }

  logout(): void {
    this.authService.logout();
  }

}

