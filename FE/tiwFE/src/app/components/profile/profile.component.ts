import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileImage') profileImage!: ElementRef;

  backgroundImageUrl: string= '';
  profileImageUrl = '';
  //Serve per non darmi errori in console
  user: any = { username: '', email: ''};

  constructor(private userService: UserService, 
              private zone: NgZone, 
              private router: Router, 
              private route: ActivatedRoute) {}  // Inject ActivatedRoute service

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    // Get username from URL
    const username = this.route.snapshot.paramMap.get('username');
  
    // Check if username is not null
    if (username) {
      // Pass username to getUser method
      this.userService.getUser(username).subscribe({
        next: (user) => {
          this.profileImageUrl = `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`;
          this.user = user;
          console.log(user); 
          this.user.followersCount = user.followers.length;
          this.user.followingCount = user.following.length;
          this.user.likesCount = user.likes.length;
          this.user.threadsCount = user.threads.length;
        },
        error: (error) => {
          console.error('There was an error!', error);
          // this.router.navigate(['/404']);
        }
      });
    } else {
      this.router.navigate(['/404']);
    }
  }
  

  onProfileImageClick() {
    this.router.navigate(['/confirmChangeImageProfile']);
  }
}
