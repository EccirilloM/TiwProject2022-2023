import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  name: string= '';
  surname: string= '';
  description: string= '';
  status: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router ) {}

  ngOnInit() {
    console.log("OnInit Registration");
  }

  registerPerson() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.username || !this.password || !this.email || !this.ripetiPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
  
    if (this.password.length < 8) {
      this.errorMessage = 'Password too short. It should be at least 8 characters.';
      return;
    }
  
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Invalid email address.';
      return;
    }
  
    if (this.password !== this.ripetiPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    
    const newPerson = {
      username: this.username.trim(),
      password: this.password,
      email: this.email.trim(),
      name: this.name.trim(),
      surname: this.surname.trim(),
      description: this.description ? this.description.trim() : null,
    };
      
    this.authService.registration(newPerson).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.username = '';
        this.password = '';
        this.email = '';
        this.name='';
        this.surname='';
        this.description='';
        this.ripetiPassword = '';

        // this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.successMessage = '';
      } 
    });
  }
  
}
