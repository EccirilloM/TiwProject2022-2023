import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  backgroundImageUrl: string= '';
  //Serve per non darmi errori in console
  user: any = { username: '', email: ''};

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser().subscribe(user => {
        // Utilizza l'URL del back-end dal tuo servizio utente
        user.profileImage = `${this.userService.backEndUrl}/profilePictures/${user.profileImage}`;
        this.user = user;
        console.log(user); // Aggiungi questa riga per vedere l'output nel console del browser
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
          this.user.profileImage = response.imagePath;
        }
      });
    }
  }
}