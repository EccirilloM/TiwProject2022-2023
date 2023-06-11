import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-confirm-change-image',
  templateUrl: './confirm-change-image.component.html',
  styleUrls: ['./confirm-change-image.component.css']
})
export class ConfirmChangeImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  username: string;

  constructor(private router: Router, private userService: UserService) {
    this.username = localStorage.getItem("username") || '';
  }

  ngOnInit() {}

  onConfirm() {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.userService.updatePhoto(this.username, file).subscribe(response => {
        // Se arriva qui, la risposta è stata di successo (status HTTP 2xx)
        this.router.navigate(['/profile']);
      }, error => {
        // Se arriva qui, c'è stato un errore (status HTTP 4xx o 5xx)
        console.error('Error during image upload:', error);
      });
    }
  }
  

  onCancel() {
    this.router.navigate(['/profile']);
  }
}









