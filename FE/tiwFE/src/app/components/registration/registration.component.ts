import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  username: string = '';
  password: string = '';
  ripetiPassword: string= '';
  email: string= '';
  status: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService ) {}

  ngOnInit() {}

  registerPerson() {
    if (this.username && this.password && this.email && this.ripetiPassword) {
      if (this.password !== this.ripetiPassword) {
        this.errorMessage = 'Passwords do not match.';
        this.successMessage = '';
        return;
      }
  
      const newPerson = {
        username: this.username,
        password: this.password,
        email: this.email,
      };
        
      this.authService.registration(newPerson).subscribe({
        next: (data: any) => {
          this.successMessage = 'Registration successful!';
          this.errorMessage = '';
          this.username = '';
          this.password = '';
          this.email = '';
          this.ripetiPassword = '';
        },
        error: (error) => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields.';
      this.successMessage = '';
    }
  }  
}
