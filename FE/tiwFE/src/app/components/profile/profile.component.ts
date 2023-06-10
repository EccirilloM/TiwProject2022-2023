import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgZone } from '@angular/core';

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

  constructor(private userService: UserService, private zone: NgZone) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser().subscribe(user => {
      this.profileImageUrl = `${this.userService.backEndUrl}/profilePictures/${user.profileImage}?${Date.now()}`;
      this.user = user;
      console.log(user); 
      this.user.followersCount = user.followers.length;
      this.user.followingCount = user.following.length;
      this.user.likesCount = user.likes.length;
      this.user.threadsCount = user.threads.length;
    },
    error => console.error('There was an error!', error)
    );
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.userService.updatePhoto(this.user.username, file).subscribe(response => {
        if (response.status === 'success') {
          // Richiedi nuovamente l'utente dopo l'aggiornamento dell'immagine
          this.getUser();
        }
      });
    }
  }



}